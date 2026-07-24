import api from "./api";

export const getNGODashboardStats = async () => {
    const response = await api.get("/api/ngo/dashboard-stats");
    return response.data;
};

export const getAvailableDonations = async () => {
    const response = await api.get("/api/ngo/donations");
    return response.data;
};

export const getAcceptedDonations = async () => {
    const response = await api.get("/api/ngo/donations/accepted");
    return response.data;
};

export const getDonationDetails = async (id) => {
    const response = await api.get(`/api/ngo/donations/${id}`);
    return response.data;
};

export const acceptDonation = async (id) => {
    const response = await api.put(`/api/ngo/donations/${id}/accept`);
    return response.data;
};

export const completeDonation = async (id) => {
    const response = await api.put(`/api/ngo/donations/${id}/complete`);
    return response.data;
};

export const getNGOHistory = async () => {
    const response = await api.get("/api/ngo/history");
    return response.data;
};

export const getNGOProfile = async () => {
    const response = await api.get("/api/ngo/profile");
    return response.data;
};

export const updateNGOProfile = async (profileData) => {
    const response = await api.put("/api/ngo/profile", profileData);
    return response.data;
};