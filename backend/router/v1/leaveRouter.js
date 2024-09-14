const express = require('express');
const router = express.Router();
const { leaveController } = require('../../controller');

// Route to get all leaves
router.get('/', leaveController.getAllLeaves);

// Route to add a new leave
router.post('/', leaveController.addLeave);

// Route to update an existing leave
router.put('/:id', leaveController.updateLeave);

// Route to delete a leave
router.delete('/:id', leaveController.deleteLeave);

module.exports = router;
