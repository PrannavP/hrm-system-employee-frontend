import React, { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { getEmployeeLeavesByEid } from "../../services/api";

type Leave = {
    id: string;
    leave_type: string;
    starting_date: string;
    ending_date: string;
    approved_by: string;
    status: "Approved" | "Pending" | "Rejected";
    reason: string;
};

const LeavesTabComponent: React.FC = () => {
    const [leavesData, setLeavesData] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    // function to get leaves of employee by EId

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            // Uncomment and use the following code to fetch leave requests
            try {
                const response = await getEmployeeLeavesByEid(user.emp_id);
                setLeavesData(response.data.fetchEmployeeLeaves);
                console.log(response);
            } catch (error) {
                console.error("Error fetching leave requests:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-orange-100 text-orange-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {leavesData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No leave requests found
                </div>
            ) : (
                leavesData.map((leave) => (
                    <div
                        key={leave.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {leave.leave_type} Leave
                            </h3>

                            <span
                                className={`${getStatusStyle(
                                    leave.status
                                )} px-3 py-1 rounded-full text-sm font-medium`}
                            >
                                {leave.status}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                            <p className="text-gray-700 text-sm">
                                {leave.status === "Approved"
                                    ? "Approved By: "
                                    : leave.status === "Rejected"
                                    ? "Rejected By: "
                                    : "Handled By: "}
                                <span className="font-bold">
                                    {leave.approved_by}
                                </span>
                            </p>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                            {new Date(leave.starting_date).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}{" "}
                            -{" "}
                            {new Date(leave.ending_date).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </div>

                        <p className="text-gray-700 text-sm">{leave.reason}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default LeavesTabComponent;
