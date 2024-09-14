const mongoose = require('mongoose');
const { Schema } = mongoose;

// Utility function to convert time string (HH:MM) to minutes for comparison
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Utility function to validate if slots overlap
const validateSlotOverlap = (slots) => {
  // Sort slots by startTime (converted to minutes)
  const sortedSlots = [...slots].sort((a, b) => {
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  // Check if any slot overlaps with the previous one
  for (let i = 1; i < sortedSlots.length; i++) {
    if (timeToMinutes(sortedSlots[i].startTime) < timeToMinutes(sortedSlots[i - 1].endTime)) {
      return false; // Overlap found
    }
  }
  return true;
}

// Sub-schema for working slots
const SlotSchema = new Schema({
  startTime: { type: String, required: true }, // Format: 'HH:MM'
  endTime: { type: String, required: true },   // Format: 'HH:MM'
}, { _id: false });

// Validation for slot duration and working hours
SlotSchema.path('endTime').validate(function (value) {
  const startTime = this.startTime;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = value.split(':').map(Number);
  
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;

  // Ensure the slot duration is at least 1 hour
  if (endTimeMinutes - startTimeMinutes < 60) {
    throw new Error('Slot duration must be at least 1 hour');
  }

  // Ensure the slots are within working hours (6 AM - 10 PM)
  if (startHour < 6 || endHour > 22 || (endHour === 22 && endMinute > 0)) {
    throw new Error('Working hours must be between 6 AM and 10 PM');
  }

  return true;
}, 'Invalid slot');

// Schedule schema with slot overlap validation
const ScheduleSchema = new Schema({
  dayOfWeek: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true 
  }, // Example: 'Monday'
  slots: {
    type: [SlotSchema],
    validate: {
      validator: validateSlotOverlap,
      message: 'Slots on the same day cannot overlap',
    },
  }
}, { _id: false });

// Main Partner schema
const PartnerSchema = new Schema({
  name: { type: String, required: true },
  weeklySchedule: [ScheduleSchema],  // Weekly schedule
});

module.exports = mongoose.model('Partner', PartnerSchema);
