import api from "./api";

export const registerBusiness = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};