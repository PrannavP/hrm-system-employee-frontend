import { useState, useEffect } from "react";
import { checkIn, checkOut } from "../../services/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types";
import { useUser } from "../../hooks/useUser";
import TimerDisplay from "./TimerComponent";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";

// Fix for missing Leaflet icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure Leaflet uses correct marker icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const CheckInOutComponent: React.FC = () => {
    const [status, setStatus] = useState<string>("");
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
    const [position, setPosition] = useState<LatLngTuple | null>(null);

    const { user } = useUser();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                },
                () => setStatus("Unable to retrieve your location.")
            );
        } else {
            setStatus("Geolocation is not supported by your browser.");
        }
    }, []);

    const getLocation = (action: "checkin" | "checkout") => {
        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]); // Update position

                console.log("Latitude:", latitude, "Longitude:", longitude);

                if (!user) {
                    setStatus("User information is missing.");
                    return;
                }

                try {
                    const response =
                        action === "checkin"
                            ? await checkIn(latitude, longitude, user.emp_id)
                            : await checkOut(user.emp_id);

                    setStatus(response.data.message);

                    if (
                        action === "checkin" &&
                        response.data.message !==
                            "Check-in failed. You are not in the office location."
                    ) {
                        setIsTimerRunning(true);
                    }

                    if (action === "checkout") {
                        setIsTimerRunning(false); // Stop the timer
                    }
                } catch (error) {
                    const err = error as AxiosError<ErrorResponse>;
                    setStatus(
                        err.response?.data?.message || "An error occurred."
                    );
                    toast.warn(err.response?.data?.message);
                }
            },
            () => setStatus("Unable to retrieve your location.")
        );
    };

    return (
        <div className="border border-gray-300 rounded-lg p-3">
            <ToastContainer autoClose={2000} closeOnClick />
            <h2 className="text-lg font-medium mb-4">Check-in & Check-out</h2>

            {/* Display map only if position is available */}
            <div className="mt-4 w-full">
                {position ? (
                    <MapContainer
                        center={position}
                        zoom={100}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        dragging={false}
                        zoomControl={false}
                        style={{ height: "400px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={position}
                            icon={L.icon({ iconUrl: markerIcon })}
                        >
                            <Popup>You are here</Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <p>Loading map...</p>
                )}
            </div>

            <div className="flex flex-col items-center mt-4">
                {/* TimerDisplay is always visible */}
                {user && (
                    <TimerDisplay emp_id={user.id} isRunning={isTimerRunning} />
                )}

                {!isTimerRunning && (
                    <button
                        onClick={() => getLocation("checkin")}
                        className="button w-45 bg-green-600 text-white py-2 rounded-sm hover:bg-green-700 mb-2"
                    >
                        Check-In
                    </button>
                )}

                {isTimerRunning && (
                    <button
                        onClick={() => getLocation("checkout")}
                        className="button w-45 bg-red-600 text-white py-2 rounded-sm hover:bg-red-700 transition"
                    >
                        Check-Out
                    </button>
                )}
            </div>

            <p className="mt-2">{status}</p>
        </div>
    );
};

export default CheckInOutComponent;
