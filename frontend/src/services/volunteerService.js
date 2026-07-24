import api from "./api";

export const registerVolunteer = async (data) => {
  const response = await api.post("/api/auth/register", {
    ...data,
    role: "volunteer",
  });
  return response.data;
};

export const getVolunteerDashboard = async () => {
  const response = await api.get("/api/volunteer/dashboard-stats");
  return response.data;
};

export const toggleVolunteerOnlineStatus = async () => {
  const response = await api.put("/api/volunteer/online-status");
  return response.data;
};

export const acceptDeliveryTask = async (donationId) => {
  const response = await api.put(`/api/volunteer/tasks/${donationId}/accept`);
  return response.data;
};

export const updateDeliveryTaskStatus = async (donationId, status) => {
  const response = await api.put(`/api/volunteer/tasks/${donationId}/update-status`, {
    status,
  });
  return response.data;
};

export const verifyPickupOTP = async (donationId, otp) => {
  const response = await api.post(`/api/volunteer/tasks/${donationId}/verify-pickup-otp`, {
    otp,
  });
  return response.data;
};

export const verifyDeliveryOTP = async (donationId, otp) => {
  const response = await api.post(`/api/volunteer/tasks/${donationId}/verify-delivery-otp`, {
    otp,
  });
  return response.data;
};
