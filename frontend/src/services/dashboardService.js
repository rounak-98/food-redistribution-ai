import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

export const getDashboardSummary = async () => {
    const response = await API.get("/dashboard/summary");
    return response.data;
};