import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/config';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch leaves from the API
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/leave`); 
        setLeaves(response.data.data);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };

    fetchLeaves();
  }, []);

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setStatus(leave.status);
    setShowModal(true);
  };

  const handleDelete = async (leaveId) => {
    try {
      await axios.delete(`${config.apiUrl}/leave/${leaveId}`);
      setLeaves(leaves.filter(leave => leave._id !== leaveId));
    } catch (error) {
      console.error('Error deleting leave:', error);
    }
  };

  const handleStatusChange = async () => {
    if (selectedLeave) {
      try {
        await axios.put(`${config.apiUrl}/leave/${selectedLeave._id}`, { status });
        setLeaves(leaves.map(leave =>
          leave._id === selectedLeave._id ? { ...leave, status } : leave
        ));
        setShowModal(false);
      } catch (error) {
        console.error('Error updating leave status:', error);
      }
    }
  };

  // Helper function to format datetime with slot
  const formatDateTime = (date, time) => {
    const dateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    dateTime.setHours(hours, minutes);
    return dateTime.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Start Date & Time</th>
            <th className="px-4 py-2 text-left">End Date & Time</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves && leaves.map(leave => {
            const startDateTime = leave.slots.length > 0
              ? formatDateTime(leave.startDate, leave.slots[0].startTime)
              : new Date(leave.startDate).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

            const endDateTime = leave.slots.length > 0
              ? formatDateTime(leave.endDate, leave.slots[leave.slots.length - 1].endTime)
              : new Date(leave.endDate).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

            return (
              <tr key={leave._id} className="border-b">
                <td className="px-4 py-2">{leave.partnerName}</td>
                <td className="px-4 py-2">{leave.status}</td>
                <td className="px-4 py-2">{startDateTime}</td>
                <td className="px-4 py-2">{endDateTime}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(leave)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(leave._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal for editing leave */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Edit Leave Status</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="DENIED">DENIED</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
