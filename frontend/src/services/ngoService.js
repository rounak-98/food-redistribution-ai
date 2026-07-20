import axios from "axios";

const API = "http://127.0.0.1:8000/api/ngo";

export const getAvailableDonations = async () => {

    const response = await axios.get(
        `${API}/donations`
    );

    return response.data;

};
export const getDonationDetails = async (id) => {

    const response = await axios.get(
        `${API}/donations/${id}`
    );

    return response.data;

};
export const acceptDonation = async (id) => {

    const response = await axios.put(
        `${API}/donations/${id}/accept`
    );

    return response.data;

};