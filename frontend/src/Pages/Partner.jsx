import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import config from "../config/config";
import Modal from "../component/Modal";
import moment from "moment";

const Partner = () => {
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate(); 

    useEffect(() => {
        axios.get(`${config.apiUrl}/partner`)
            .then(res => {
                setWorkers(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleShowClick = (e, worker) => {
        setSelectedWorker(worker);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedWorker(null);
        setSelectedDate(null);
        setShowModal(false);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const getSlotsForSelectedDate = () => {
        if (!selectedDate || !selectedWorker) return [];

        const dayOfWeek = moment(selectedDate).format('dddd');
        const scheduleForDay = selectedWorker.weeklySchedule.find(schedule => schedule.dayOfWeek === dayOfWeek);

        return scheduleForDay ? scheduleForDay.slots : [];
    };

    // Redirect to AddLeave page
    const handleAddLeaveClick = (workerId) => {
        navigate(`/add-leave/${workerId}`); 
    };

    return (
        <>
            <div className="p-4">
                {/* Table */}
                <table className="min-w-full bg-white border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border-b">Worker</th>
                            <th className="p-2 border-b">Calendar</th>
                            <th className="p-2 border-b">Add Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers?.map(worker => (
                            <tr key={worker._id}>
                                <td className="p-2 border-b">{worker.name}</td>
                                <td className="p-2 border-b flex justify-center space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={(e) => handleShowClick(e, worker)}
                                    >
                                        Show
                                    </button>
                                </td>
                                <td className="p-2 border-b">
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleAddLeaveClick(worker._id)}
                                    >
                                        Add Leave
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedWorker && (
                <Modal onClose={handleCloseModal} title={`${selectedWorker.name}'s Schedule`}>
                    <div>
                        <label htmlFor="date" className="block text-gray-700">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            className="mt-1 mb-3 p-2 border border-gray-300 rounded"
                            value={selectedDate || ''}
                            onChange={handleDateChange}
                        />
                        {selectedDate && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Slots for {moment(selectedDate).format('MMMM Do YYYY')}:</h3>
                                <ul>
                                    {getSlotsForSelectedDate().length > 0 ? (
                                        getSlotsForSelectedDate().map((slot, index) => (
                                            <li key={index} className="mb-1">
                                                {slot.startTime} - {slot.endTime}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No slots available for this date.</p>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Partner;
