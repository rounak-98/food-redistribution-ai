import api from "./api";

export const registerIndividual = async (data) => {
  const response = await api.post("/api/auth/register", {
    ...data,
    role: "individual",
  });
  return response.data;
};

export const getIndividualDashboard = async () => {
  const response = await api.get("/api/individual/dashboard-stats");
  return response.data;
};

export const postIndividualDonation = async (donationData) => {
  const response = await api.post("/api/individual/donate", donationData);
  return response.data;
};
