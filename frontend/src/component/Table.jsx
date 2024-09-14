import React, { useState } from 'react';

const Table = () => {
  const [data, setData] = useState([
    { id: 1, worker_name: 'Alice', leave_status: 'Approved', start_date: '2024-09-01T08:00', end_date: '2024-09-05T17:00', applied_on: '2024-08-30', slot: 'Full Day' },
    { id: 2, worker_name: 'Bob', leave_status: 'Pending', start_date: '2024-09-10T09:00', end_date: '2024-09-12T15:00', applied_on: '2024-09-01', slot: 'Half Day' }
  ]);

  const [editingRow, setEditingRow] = useState(null);
  const [popupData, setPopupData] = useState({});
  const [newLeave, setNewLeave] = useState({
    worker_name: '',
    start_date: '',
    end_date: '',
    slot: 'Full Day',
    leave_status: 'Pending',
    applied_on: new Date().toISOString().split('T')[0]  // Default to today's date
  });
  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleEditClick = (row) => {
    setEditingRow(row.id);
    setPopupData({ ...row });
  };

  const handleDeleteClick = (id) => {
    setData(data.filter(row => row.id !== id));
  };

  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setPopupData({ ...popupData, [name]: value });
  };

  const handlePopupSave = () => {
    setData(data.map(row => (row.id === editingRow ? popupData : row)));
    setEditingRow(null);
  };

  const handlePopupClose = () => {
    setEditingRow(null);
  };

  const handleNewLeaveChange = (e) => {
    const { name, value } = e.target;
    setNewLeave({ ...newLeave, [name]: value });
  };

  const handleAddLeave = () => {
    const newId = data.length ? Math.max(data.map(row => row.id)) + 1 : 1;
    setData([...data, { id: newId, ...newLeave }]);
    setNewLeave({
      worker_name: '',
      start_date: '',
      end_date: '',
      slot: 'Full Day',
      leave_status: 'Pending',
      applied_on: new Date().toISOString().split('T')[0]  // Reset to today's date
    });
    setShowAddPopup(false);
  };

  return (
    <div className="p-4">
      {/* Add Leave Button */}
      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddPopup(true)}
        >
          Add Leave
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border-b">Worker</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Start Date</th>
            <th className="p-2 border-b">End Date</th>
            <th className="p-2 border-b">Applied On</th>
            <th className="p-2 border-b">Slot</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td className="p-2 border-b">{row.worker_name}</td>
              <td className="p-2 border-b">{row.leave_status}</td>
              <td className="p-2 border-b">{new Date(row.start_date).toLocaleString()}</td>
              <td className="p-2 border-b">{new Date(row.end_date).toLocaleString()}</td>
              <td className="p-2 border-b">{row.applied_on}</td>
              <td className="p-2 border-b">{row.slot}</td>
              <td className="p-2 border-b flex justify-center space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEditClick(row)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteClick(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Leave Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add New Leave</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="worker_name">Worker Name:</label>
              <input
                type="text"
                id="worker_name"
                name="worker_name"
                value={newLeave.worker_name}
                onChange={handleNewLeaveChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="start_date">Start Date & Time:</label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                value={newLeave.start_date}
                onChange={handleNewLeaveChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="end_date">End Date & Time:</label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={newLeave.end_date}
                onChange={handleNewLeaveChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="slot">Slot:</label>
              <select
                id="slot"
                name="slot"
                value={newLeave.slot}
                onChange={handleNewLeaveChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="Full Day">Full Day</option>
                <option value="Half Day">Half Day</option>
                <option value="Quarter Day">Quarter Day</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="applied_on">Applied On:</label>
              <input
                type="date"
                id="applied_on"
                name="applied_on"
                value={newLeave.applied_on}
                onChange={handleNewLeaveChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddLeave}
              >
                Add Leave
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowAddPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {editingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Edit Leave Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="applied_on">Applied On:</label>
              <input
                type="date"
                id="applied_on"
                name="applied_on"
                value={popupData.applied_on}
                onChange={handlePopupChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="start_date">Start Date & Time:</label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                value={popupData.start_date}
                onChange={handlePopupChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="end_date">End Date & Time:</label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={popupData.end_date}
                onChange={handlePopupChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="leave_status">Leave Status:</label>
              <select
                id="leave_status"
                name="leave_status"
                value={popupData.leave_status}
                onChange={handlePopupChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePopupSave}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={handlePopupClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
