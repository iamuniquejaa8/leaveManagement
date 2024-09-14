import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddLeave = () => {
  const { partnerId } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch partner schedule
  const fetchPartnerSchedule = async () => {
    try {
      const response = await axios.get(`/api/partner/${partnerId}`);
      setSchedule(response.data.data.weeklySchedule);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partner schedule:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerSchedule();
  }, [partnerId]);

  // Handle slot change
  const handleSlotChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedSlots(value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (startDate > endDate) {
      alert('End Date cannot be earlier than Start Date');
      return;
    }

    const isSingleDay = startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0];
    
    // Set time to 00:00:00 for multiple day leave
    if (!isSingleDay) {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    }

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    let leaveSlots = [];
    if (isSingleDay) {
      // Fetch the schedule for the selected day
      const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'long' });
      const currentDaySchedule = schedule.find(day => day.dayOfWeek === dayOfWeek);

      leaveSlots = selectedSlots.map(slot => {
        const matchedSlot = currentDaySchedule?.slots.find(s => s.startTime === slot);
        return matchedSlot || null;
      }).filter(Boolean);
    }

    const leaveRequest = {
      partnerId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      slots: isSingleDay ? leaveSlots : [], // Include slots only for single-day leave
    };

    try {
      await axios.post(`/api/leave`, leaveRequest);
      alert('Leave applied successfully');
    } catch (error) {
      console.error('Error applying leave:', error);
      alert('Failed to apply leave');
    }
  };

  // Helper function to get date range
  const getDateRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  // Determine the day of the week
  const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'long' });
  const singleDay = startDate.toISOString().split('T')[0];
  
  // Extract slots for the current day
  const currentDaySchedule = schedule.find(day => day.dayOfWeek === dayOfWeek);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Apply Leave</h1>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          minDate={new Date()}
          className="w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          minDate={startDate}
          className="w-full border-gray-300 rounded-md p-2"
        />
      </div>

      {startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0] && (
        <>
          <h2 className="text-xl font-semibold mb-4">Select Slots</h2>
          <div className="mb-4">
            <select
              multiple
              value={selectedSlots}
              onChange={handleSlotChange}
              className="w-full border-gray-300 rounded-md p-2"
            >
              {currentDaySchedule?.slots.map((slot) => (
                <option key={slot.startTime} value={slot.startTime}>
                  {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Submit Leave
      </button>
    </div>
  );
};

export default AddLeave;
