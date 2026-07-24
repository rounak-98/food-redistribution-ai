import api from "./api";

export const getAdminStats = async () => {
  const response = await api.get("/api/admin/dashboard-stats");
  return response.data;
};

export const getAdminUsers = async (role = "all", search = "") => {
  const response = await api.get("/api/admin/users", {
    params: { role, search },
  });
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/api/admin/users/${userId}`);
  return response.data;
};

export const getAdminDonations = async () => {
  const response = await api.get("/api/admin/donations");
  return response.data;
};

export const getAdminDeliveries = async () => {
  const response = await api.get("/api/admin/deliveries");
  return response.data;
};
