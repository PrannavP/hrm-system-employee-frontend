import { useEffect, useState } from 'react';
import { employeeLeavesData, employeeAttendanceData } from '../../services/api';
import { useUser } from '../../hooks/useUser';

import { FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const EmployeeDetailsComponents = () => {
    const { user } = useUser();

    const [leavesDaysCount, setLeavesDaysCount] = useState<number | null>(null);
    const [presentDaysCount, setPresentDaysCount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLoading, setUserLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (user && user.id && user.emp_id) {
                try {
                    // console.log('User data:', user); // Log user data

                    const leavesResponse = await employeeLeavesData(user.id, true);
                    setLeavesDaysCount(leavesResponse.data.total_days);

                    const attendanceResponse = await employeeAttendanceData(user.emp_id, true);
                    setPresentDaysCount(attendanceResponse.data.present_days);
                } catch (error) {
                    console.log(`Error while fetching user leaves day count: ${error}`);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('User data not available or invalid emp_id');
                setLoading(false);
            }
        };

        if (user) {
            setUserLoading(false);
            fetchEmployeeData();
        } else {
            console.log('Waiting for user data...');
        }
    }, [user]);

    if (userLoading) {
        return <div>Loading user data...</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User data not loaded</div>;
    }

    return (
        <div className="flex justify-around mt-4 mb-2">
            <div className="border border-gray-300 rounded-lg p-4 w-1/3 mx-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Present Days</h3>
                    <FaCheckCircle className="text-green-600" />
                </div>
                <p className="text-4xl font-bold mt-2">{presentDaysCount !== null ? presentDaysCount : 'N/A'}</p>
                <p className="text-gray-500">This month</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 w-1/3 mx-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Leave Days</h3>
                    <FaCalendarAlt className="text-blue-600" />
                </div>
                <p className="text-4xl font-bold mt-2">{leavesDaysCount !== null ? leavesDaysCount : 'N/A'}</p>
                <p className="text-gray-500">This month</p>
            </div>
        </div>
    );
};

export default EmployeeDetailsComponents;