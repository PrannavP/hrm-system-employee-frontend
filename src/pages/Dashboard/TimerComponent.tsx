import { useEffect, useState } from "react";
import { getSyncedTime, timerSyncRequest } from "../../services/api";

interface TimerDisplayProps {
    emp_id: number;
    isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ emp_id, isRunning }) => {
    const [duration, setDuration] = useState<string>("00:00:00");
    const [syncedTime, setSyncedTime] = useState<string | null>(null);

    useEffect(() => {
        const fetchCheckInTime = async () => {
            try {
                const response = await getSyncedTime(emp_id);
                console.log(response.data);
                if (response.status === 200) {
                    setSyncedTime(response.data.getTimerData.check_in_time);
                } else {
                    console.error("Failed to fetch check-in time.");
                }
            } catch (error) {
                console.error("Error fetching check-in time:", error);
            }
        };

        fetchCheckInTime();
    }, [emp_id]);

    useEffect(() => {
        if (!syncedTime) return;

        const updateDuration = () => {
            const now = new Date();
            const checkInTime = new Date(syncedTime);
            const diffMs = now.getTime() - checkInTime.getTime();

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            setDuration(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
        };

        if (isRunning) {
            updateDuration();
            const interval = setInterval(updateDuration, 1000);
            return () => clearInterval(interval);
        }
    }, [syncedTime, isRunning]);

    return <p className="mt-2">{duration}</p>;
};

export default TimerDisplay;