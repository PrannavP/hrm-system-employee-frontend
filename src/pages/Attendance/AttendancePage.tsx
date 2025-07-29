import { useEffect, useState } from "react";
import SideNavBar from "../../components/SideNavBar";
import withAuthRedirect from "../../hocs/withAuthRedirect";
import { useUser } from "../../hooks/useUser";
import { getEmployeeAttendance } from "../../services/api";

type Attendance = {
    id: number;
    emp_id: string;
    date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    total_work_hours: string | null;
    status: string;
    created_at: string;
};

const AttendancePage: React.FC = () => {
    const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            fetchAttendance(user.emp_id);
        }
    }, [user]);

    const fetchAttendance = async (id: string) => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await getEmployeeAttendance(id);
            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    function formatWorkHours(workHours: any) {
        if (!workHours) return "-";
        if (typeof workHours === "string") return workHours;
        if (typeof workHours === "object") {
            // Try to format as HH:MM:SS
            const { minutes = 0, seconds = 0, milliseconds = 0, hours = 0 } = workHours;
            const pad = (n: number) => n.toString().padStart(2, "0");
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        return "-";
    };

    return (
        <div className="flex font-sans bg-gray-100 min-h-screen">
            <SideNavBar />
            <div className="flex-grow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Records</h2>
                <div className="max-w-7xl mx-auto overflow-x-auto rounded-xl shadow-md bg-white border border-gray-200">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-medium text-gray-600 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-4 font-medium text-gray-600 uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-4 font-medium text-gray-600 uppercase tracking-wider">Total Hours</th>
                                <th className="px-6 py-4 font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {attendanceData.map((att) => (
                                <tr key={att.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{new Date(att.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-600">{att.check_in_time ? att.check_in_time.slice(0, 5) : "-"}</td>
                                    <td className="px-6 py-4 text-gray-600">{att.check_out_time ? att.check_out_time.slice(0, 5) : "-"}</td>
                                    <td className="px-6 py-4 text-gray-600">{formatWorkHours(att.total_work_hours)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                                            ${att.status === "Present"
                                                ? "bg-green-50 text-green-600"
                                                : att.status === "Absent"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-yellow-50 text-yellow-600"
                                            }
                                        `}>
                                            {att.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="p-4 text-center text-sm text-gray-500">
                            Loading attendance...
                        </div>
                    )}
                    {!loading && attendanceData.length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No attendance records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AuthRedirectedAttendance = withAuthRedirect(AttendancePage);
export default AuthRedirectedAttendance;