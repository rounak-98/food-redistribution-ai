import api from "./api";

export const createDonation = async (data) => {
  const response = await api.post("/api/donations/", data);
  return response.data;
};

export const getBusinessDonations = async () => {
  const response = await api.get(
    "/api/donations/my"
  );

  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get(
    "/api/donations/dashboard/my"
  );

  return response.data;
};