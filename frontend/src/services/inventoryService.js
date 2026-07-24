import api from "./api";

export const getInventory = async () => {
  const response = await api.get(
    "/api/inventory/my"
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

export const deleteInventoryItem = async (itemId) => {
  const response = await api.delete(
    `/api/inventory/${itemId}`
  );

  return response.data;
};

export const autoDonateInventoryItem = async (itemId) => {
  const response = await api.post(
    `/api/inventory/${itemId}/auto-donate`
  );

  return response.data;
};

export const autoDonateItem = autoDonateInventoryItem;



export async function getProductByBarcode(barcode) {
    const response = await fetch(`http://127.0.0.1:8000/barcode/${barcode}`);

    if (!response.ok) {
        throw new Error("Product not found");
    }

    return await response.json();
}