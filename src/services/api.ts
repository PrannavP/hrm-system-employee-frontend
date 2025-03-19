import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const checkIn = async (latitude: number, longitude: number) => {
    return axios.post(`${API_URL}/checkin`, { latitude, longitude });
};

export const checkOut = async (latitude: number, longitude: number) => {
    return axios.post(`${API_URL}/checkout`, { latitude, longitude });
};