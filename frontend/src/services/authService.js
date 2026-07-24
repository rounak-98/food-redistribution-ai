import api from "./api";

export const registerBusiness = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const registerNGO = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const getBusinessProfile = async () => {
  const response = await api.get("/api/business/profile");
  return response.data;
};

export const updateBusinessProfile = async (data) => {
  const response = await api.put("/api/business/profile", data);
  return response.data;
};