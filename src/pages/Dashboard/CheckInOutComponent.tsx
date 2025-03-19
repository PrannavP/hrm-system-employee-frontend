import { useState } from "react";
import { checkIn, checkOut } from "../../services/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types";

const CheckInOutComponent: React.FC = () => {
    const [status, setStatus] = useState<string>("");

    const getLocation = (action: "checkin" | "checkout") => {
        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = action === "checkin"
                        ? await checkIn(latitude, longitude)
                        : await checkOut(latitude, longitude);

                    setStatus(response.data.message);
                } catch (error) {
                    // setting error type so we won't get error
                    const err = error as AxiosError<ErrorResponse>;
                    setStatus(err.response?.data?.message || "An error occurred.");
                }
            },
            () => setStatus("Unable to retrieve your location.")
        );
    };

    return (
        <div>
            <h2>Check-in & Check-out</h2>
            <button onClick={() => getLocation("checkin")} className="button w-45 bg-green-600 text-white py-2 rounded-sm hover:bg-green-700 transition">Check-In</button>
            <button onClick={() => getLocation("checkout")} className="button w-45 bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition">Check-Out</button>
            <p>{status}</p>
        </div>
    );
};

export default CheckInOutComponent;
