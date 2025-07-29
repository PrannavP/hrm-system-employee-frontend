import axios from "axios";

const API_URL = "http://localhost:5000/api";

// checkin api function
export const checkIn = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkin`, { latitude, longitude, emp_id });
};

// checkout api function
// export const checkOut = async (latitude: number, longitude: number, emp_id: string) => {
//     return axios.post(`${API_URL}/checkout`, { latitude, longitude, emp_id });
// };

export const checkOut = async (emp_id: string) => {
    return axios.post(`${API_URL}/checkout`, { emp_id });
};

// login api function
export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}/login-employee`, { email, password });
};

// employee leaves data api function
export const employeeLeavesData = async (emp_id: number, thisMonth: boolean) => {
    return axios.post(`${API_URL}/get-employee-leaves`, { emp_id, thisMonth });
};

// employee attendance data api function
export const employeeAttendanceData = async (emp_id: string, thisMonth: boolean) => {
    return axios.post(`${API_URL}/get-employee-attendance`, { emp_id, thisMonth });
};

// employee leave request api function
export const employeeLeaveRequest = async (leave_type: string, starting_date: string, ending_date: string, emp_id: string, reason: string) => {
    return axios.post(`${API_URL}/ask-leave`, { leave_type, starting_date, ending_date, emp_id, reason });
};

// employee get leave requests api function
export const getEmployeeLeavesByEid = async(eid: string) => {
    return axios.get(`${API_URL}/get-leaves/${eid}`);
};

// timer sync api function
export const timerSyncRequest = async(emp_id: number) => {
    return axios.post(`${API_URL}/sync-timer`, { emp_id });
};

// timer sync get api function
export const getSyncedTime = async(emp_id: number) => {
    return axios.post(`${API_URL}/get-synced-timer`, { emp_id });
};

// Get tasks by employee ID not emp_id
export const getEmployeeTasksById = async(emp_id: number) => {
    return axios.get(`${API_URL}/tasks/get-tasks/${emp_id}`);
};

// Get attendance by emp_id not ID
export const getEmployeeAttendance = async(emp_id: string) => {
    return axios.get(`${API_URL}/attendance/${emp_id}`);
};

// Get tasks by employee ID not emp_id and task_id
export const getEmployeeAssignedTasks = async(emp_id: number, task_id: number) => {
    return axios.get(`${API_URL}/tasks/get-tasks/${emp_id}/${task_id}`);
};

// Update task status
export const updateTaskStatus = async (taskId: number, status: string) => {
    return axios.post(`${API_URL}/tasks/update-task-field`, {
        taskId,
        field: 'status',
        value: status,
    });
};