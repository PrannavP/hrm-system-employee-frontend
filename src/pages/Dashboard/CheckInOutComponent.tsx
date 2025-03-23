import { useState, useEffect } from "react";
import { checkIn, checkOut } from "../../services/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types";
import { useUser } from "../../hooks/useUser";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [position, setPosition] = useState<LatLngTuple | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      console.log("User Data:", user);
    }
  }, [user]);

  useEffect(() => {
    const storedCheckInTime = localStorage.getItem("checkInTime");
    if (storedCheckInTime) {
      const parsedCheckInTime = new Date(storedCheckInTime);
      setCheckInTime(parsedCheckInTime);
    }
  }, []);

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
              : await checkOut(latitude, longitude, user.emp_id);

          setStatus(response.data.message);

          if (
            action === "checkin" &&
            response.data.message !==
              "Check-in failed. You are not in the office location."
          ) {
            const now = new Date();
            setCheckInTime(now);
            localStorage.setItem("checkInTime", now.toISOString());
            updateElapsedTime(now);
          }

          if (action === "checkout") {
            setCheckInTime(null);
            localStorage.removeItem("checkInTime");
          }
        } catch (error) {
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
    setElapsedTime(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    );
  };

  useEffect(() => {
    if (checkInTime) {
      updateElapsedTime(checkInTime); // Update immediately
      const interval = setInterval(() => updateElapsedTime(checkInTime), 1000);
      return () => clearInterval(interval);
    }
  }, [checkInTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-3">
      <h2 className="text-lg font-medium mb-4">Check-in & Check-out</h2>
      {/* Display map only if position is available */}
      <div className="mt-4 w-full">
        {position ? (
          <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
      <div className="flex flex-col items-center mt-4">
        <p className="mb-4 font-medium text-3xl">{elapsedTime}</p>
        {!checkInTime && (
          <button
            onClick={() => getLocation("checkin")}
            className="w-45 bg-green-600 text-white py-2 rounded-sm hover:bg-green-700 mb-2"
          >
            Check-In
          </button>
        )}
        {checkInTime && (
          <button
            onClick={() => getLocation("checkout")}
            className="w-45 bg-red-600 text-white py-2 rounded-sm hover:bg-red-700 transition"
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