import api from "./api";

export const getAvailableDonations = async () => {
    const response = await api.get("/api/ngo/donations");
    return response.data;
};


export const getDonationDetails = async (id) => {
    const response = await api.get(`/api/ngo/donations/${id}`);
    return response.data;
};


export const acceptDonation = async (id) => {
    console.log("Calling accept API for donation:", id);

    const response = await api.put(`/api/ngo/donations/${id}/accept`);

    console.log("Accept API response:", response);

    return response.data;
};