import api from "./api";

export const getMLSurplusForecast = async () => {
  const response = await api.get("/api/ml/forecast-surplus");
  return response.data;
};

export const getMLSpoilageRisk = async (data) => {
  const response = await api.post("/api/ml/spoilage-risk", data);
  return response.data;
};

export const getMLNGOMatches = async () => {
  const response = await api.get("/api/ml/match-ngos");
  return response.data;
};
