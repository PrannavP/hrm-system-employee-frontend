import { useState, useEffect } from "react";
import { checkIn, checkOut } from "../../services/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types";

const CheckInOutComponent: React.FC = () => {
    const [status, setStatus] = useState<string>("");
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState<string>("");

    const getLocation = (action: "checkin" | "checkout") => {
        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                console.log(latitude);
                console.log(longitude);

                if (action === "checkin") {
                    const now = new Date();
                    setCheckInTime(now);
                    updateElapsedTime(now);
                }

                try {
                    const response = action === "checkin"
                        ? await checkIn(latitude, longitude)
                        : await checkOut(latitude, longitude);

                    setStatus(response.data.message);

                    if (action === "checkout") {
                        setCheckInTime(null);
                    }
                } catch (error) {
                    // setting error type so we won't get error
                    const err = error as AxiosError<ErrorResponse>;
                    setStatus(err.response?.data?.message || "An error occurred.");
                }
            },
            () => setStatus("Unable to retrieve your location.")
        );
    };

    const updateElapsedTime = (checkInTime: Date) => {
        const now = new Date();
        const diff = now.getTime() - checkInTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        const displayTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        setElapsedTime(displayTime);
    };

    useEffect(() => {
        if (checkInTime) {
            updateElapsedTime(checkInTime); // Update immediately
            const interval = setInterval(() => {
                updateElapsedTime(checkInTime);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [checkInTime]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="border border-gray-300 rounded-lg p-3">
            <h2 className="text-lg font-medium mb-4">Check-in & Check-out</h2>
            <div className="flex flex-col items-center">
                <p className="mb-4 font-medium text-3xl">{elapsedTime}</p>
                {!checkInTime && (
                    <button
                        onClick={() => getLocation("checkin")}
                        className="button w-45 bg-green-600 text-white py-2 rounded-sm hover:bg-green-700 mb-2"
                    >
                        Check-In
                    </button>
                )}
                {checkInTime && (
                    <button
                        onClick={() => getLocation("checkout")}
                        className="button w-45 bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition"
                    >
                        Check-Out
                    </button>
                )}
            </div>
            <p className="mt-2">{status}</p>
            {checkInTime && <p className="mt-2">Checked in at: {formatTime(checkInTime)}</p>}
        </div>
    );
};

export default CheckInOutComponent;