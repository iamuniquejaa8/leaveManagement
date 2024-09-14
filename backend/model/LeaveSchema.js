const mongoose = require('mongoose');
const { Schema } = mongoose;

// Utility function to convert time strings (HH:MM) to minutes for easier comparison
const timeToMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

// Utility function to check if two slots overlap
const checkSlotOverlap = (existingSlots, newSlots) => {
  for (let i = 0; i < existingSlots.length; i++) {
    const existingSlot = existingSlots[i];
    const existingStart = timeToMinutes(existingSlot.startTime);
    const existingEnd = timeToMinutes(existingSlot.endTime);

    for (let j = 0; j < newSlots.length; j++) {
      const newSlot = newSlots[j];
      const newStart = timeToMinutes(newSlot.startTime);
      const newEnd = timeToMinutes(newSlot.endTime);

      if (newStart < existingEnd && newEnd > existingStart) {
        return true;  // Overlap found
      }
    }
  }
  return false;
};

// Utility function to check if leave dates overlap
const checkDateOverlap = (leaves, newLeave) => {
  for (let i = 0; i < leaves.length; i++) {
    const leave = leaves[i];

    // Check for date range overlap
    if (newLeave.startDate <= leave.endDate && newLeave.endDate >= leave.startDate) {
      // Check for multi-day overlap
      if (newLeave.startDate.getTime() <= leave.endDate.getTime() &&
          newLeave.endDate.getTime() >= leave.startDate.getTime()) {
        return true; // Overlap found
      }

      // If it's a single-day leave, check if the slots overlap
      if (newLeave.startDate.getTime() === leave.startDate.getTime() && 
          leave.slots.length > 0 && newLeave.slots.length > 0) {
        if (checkSlotOverlap(leave.slots, newLeave.slots)) {
          return true; // Slot overlap found on the same day
        }
      }
    }
  }
  return false;
};

// Schema for time slots
const SlotSchema = new Schema({
  startTime: { type: String, required: true }, // Format: 'HH:MM'
  endTime: { type: String, required: true },   // Format: 'HH:MM'
}, { _id: false });

// Leave Schema
const LeaveSchema = new Schema({
  partnerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Partner', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  // For single-day leave, we store the time slots
  slots: {
    type: [SlotSchema], 
    validate: {
      validator: function(slots) {
        // Ensure that slots are only defined for single-day leaves
        if (this.startDate.getTime() !== this.endDate.getTime() && slots.length > 0) {
          return false;
        }
        return true;
      },
      message: 'Slots can only be specified for single-day leaves'
    }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'DENIED'], 
    default: 'PENDING' 
  },
  appliedOn: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save middleware to validate no overlapping leaves for the same partner
LeaveSchema.pre('save', async function(next) {
  try {
    const existingLeaves = await mongoose.model('Leave').find({
      partnerId: this.partnerId,
      _id: { $ne: this._id }
    });

    if (checkDateOverlap(existingLeaves, this)) {
      return next(new Error('Leave period overlaps with another leave or time slot'));
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Leave', LeaveSchema);
