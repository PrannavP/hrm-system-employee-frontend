import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { employeeLeaveRequest } from "../../services/api";
import { useUser } from "../../hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/global.css";
import "../../styles/global.css"; // Import custom CSS

const AskLeavesComponent = () => {
    const [leaveType, setLeaveType] = useState("");
    const [leaveMode, setLeaveMode] = useState<"single" | "range">("single");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [startingDate, setStartingDate] = useState<Date | null>(null);
    const [endingDate, setEndingDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [reason, setReason] = useState("");
    const { user } = useUser();

    // Get today's date for disabling past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Handle date selection
    const handleDateChange = (value: Date | [Date | null, Date | null] | null) => {
        if (leaveMode === "single") {
            if (value instanceof Date) {
                setSelectedDate(value);
                setStartingDate(value);
                setEndingDate(value);
            }
        } else if (Array.isArray(value) && value.length === 2) {
            setStartingDate(value[0] || null);
            setEndingDate(value[1] || null);
        }
        setShowCalendar(false);
    };

    // Handle outside click to close calendar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as Element).closest(".calendar-container")) {
                setShowCalendar(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const formatDate = (date: Date | null) => {
        return date ? date.toISOString().slice(0, 10) : null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            console.error("User is not logged in");
            return;
        }

        const formattedStartingDate = formatDate(startingDate);
        const formattedEndingDate = formatDate(endingDate);

        try {
            // API call
            const response = await employeeLeaveRequest(
                leaveType,
                formattedStartingDate || "",
                formattedEndingDate || "",
                user.emp_id,
                reason
            );

            if (response.status === 201) {
                toast.success("Leave request submitted successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("Couldn't request leave. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            toast.error("Error submitting leave request. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error("Error submitting leave request:", error);
        }

        // Cleanup input fields
        setLeaveType("");
        setLeaveMode("single");
        setSelectedDate(null);
        setStartingDate(null);
        setEndingDate(null);
        setReason("");
    };

    // Custom tile class to style Sundays
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month" && date.getDay() === 0) {
            return "custom-sunday"; // Apply custom class to Sundays
        }
        return null;
    };

    return (
        <div className="max-w-7xl p-4 -lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-2">Apply for Leave</h2>
            <p className="text-gray-500 mb-4">Submit a new leave request</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Leave Type */}
                <div>
                    <label className="block font-medium mb-1">Leave Type</label>
                    <select
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                    >
                        <option value="">Select leave type</option>
                        <option value="Sick">Sick</option>
                        <option value="Annual">Annual</option>
                        <option value="Casual">Casual</option>
                    </select>
                </div>

                {/* Leave Mode Toggle */}
                <div>
                    <label className="block font-medium mb-1">Leave Mode</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="leaveMode"
                                value="single"
                                checked={leaveMode === "single"}
                                onChange={() => setLeaveMode("single")}
                            />
                            <span className="ml-2">Single Day</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="leaveMode"
                                value="range"
                                checked={leaveMode === "range"}
                                onChange={() => setLeaveMode("range")}
                            />
                            <span className="ml-2">Range</span>
                        </label>
                    </div>
                </div>

                {/* Calendar Picker */}
                <div>
                    <label className="block font-medium mb-1">Select Date(s)</label>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full p-2 border rounded-md flex justify-between items-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCalendar(!showCalendar);
                            }}
                        >
                            {leaveMode === "single"
                                ? selectedDate
                                    ? formatDate(selectedDate)
                                    : "Select a date"
                                : startingDate && endingDate
                                ? `${formatDate(startingDate)} - ${formatDate(endingDate)}`
                                : "Select date range"}
                        </button>
                        {showCalendar && (
                            <div
                                className="calendar-container absolute z-10 bg-white shadow-lg p-4 rounded-md"
                                style={{ bottom: "100%", marginBottom: "10px" }} // Position above the button
                            >
                                <div className="flex justify-end mb-2">
                                    <button
                                        type="button"
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowCalendar(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <Calendar
                                    selectRange={leaveMode === "range"} // Enable range mode only if leaveMode is 'range'
                                    onChange={handleDateChange}
                                    value={
                                        leaveMode === "single"
                                            ? selectedDate
                                            : [startingDate, endingDate]
                                    }
                                    minDate={today} // Disable past dates
                                    tileClassName={tileClassName} // Apply custom class to Sundays
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block font-medium mb-1">Reason</label>
                    <textarea
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                        placeholder="Provide a reason for your leave request"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="button w-full bg-black text-white p-3 rounded-md hover:bg-gray-800"
                >
                    Submit Leave Request
                </button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default AskLeavesComponent;