import api from "./api";

export const createDonation = async (data) => {
  const response = await api.post("/api/donations/", data);
  return response.data;
};

export const getBusinessDonations = async (businessId) => {
  const response = await api.get(
    `/api/donations/business/${businessId}`
  );

  return response.data;
};

export const getDashboardStats = async (businessId) => {
  const response = await api.get(
    `/api/donations/dashboard/${businessId}`
  );

  return response.data;
};