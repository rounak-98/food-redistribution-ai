import api from "./api";

export const getInventory = async (businessId) => {
  const response = await api.get(
    `/api/inventory/${businessId}`
  );

  return response.data;
};

export const addInventory = async (data) => {
  const response = await api.post(
    "/api/inventory/",
    data
  );

  return response.data;
};

export const uploadInventoryCSV = async (businessId, file) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/api/inventory/upload-csv/${businessId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};