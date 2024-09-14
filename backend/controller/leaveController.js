const { Leave, Partner } = require('../model');
const { response } = require('../utils');

// Get all leaves, sorted by date of application
const getAllLeaves = async (req, res) => {
  try {
    // Fetch leaves and populate the partnerId field with partner details, selecting only the name field
    const leaves = await Leave.find()
      .sort({ appliedOn: -1 })
      .populate({
        path: 'partnerId',
        select: 'name weeklySchedule', // Only include the name field from the Partner schema
      });

    // Map leaves to include the partner name directly in the leave object
    const leavesWithPartnerName = leaves.map(leave => ({
      ...leave.toObject(), 
      partnerName: leave.partnerId.name,
      partnerSlots: leave.partnerId.weeklySchedule, // Include partner slots in the leave object
    }));

    const data = response(200, leavesWithPartnerName, null, 'Leaves fetched successfully');
    res.status(200).json(data);
  } catch (error) {
    const data = response(500, null, error, 'Error fetching leaves');
    res.status(500).json(data);
  }
};


// Add a new leave for a partner
const addLeave = async (req, res) => {
  try {
    const { partnerId, startDate, endDate, slots } = req.body;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      throw new Error('Partner not found');
    }

    const leave = new Leave({ partnerId, startDate, endDate, slots });
    await leave.save();

    const data = response(201, leave, null, 'Leave added successfully');
    
    res.status(201).json(data);

  } catch (error) {
    const data = response(500, null, error, 'Error adding leave');
    res.status(500).json(data);
  }
};

// Edit an existing leave (Approve, Deny, or Modify)
const updateLeave = async (req, res) => {
  try {
    const { status, startDate, endDate, slots } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      throw new Error('Leave not found');
    }

    leave.status = status || leave.status;
    leave.startDate = startDate || leave.startDate;
    leave.endDate = endDate || leave.endDate;
    leave.slots = slots || leave.slots;

    await leave.save();

    const data = response(200, leave, null, 'Leave updated successfully');

    res.status(200).json(data);
  } catch (error) {
    const data = response(500, null, error, 'Error updating leave');
    res.status(500).json(data);
  }
};

// Delete a leave
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);

    const data = response(200, null, null, 'Leave deleted successfully');
    res.status(200).json(data);

  } catch (error) {
    const data = response(500, null, error, 'Error deleting leave');
    res.status(500).json(data);
  }
};

module.exports = {
  getAllLeaves,
  addLeave,
  updateLeave,
  deleteLeave,
};
