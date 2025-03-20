import axios from "axios";

const API_URL = "http://localhost:5000/api";

// checkin api function
export const checkIn = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkin`, { latitude, longitude, emp_id });
};

// checkout api function
export const checkOut = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkout`, { latitude, longitude, emp_id });
};

// login api function
export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}/login-employee`, { email, password });
};