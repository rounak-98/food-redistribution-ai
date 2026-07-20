import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  addInventory,
  getProductByBarcode
} from "../services/inventoryService";

export default function AddInventoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const businessId = storedUser?.business?.id;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    business_id: businessId,
    product_name: "",
    category: "",
    quantity: "",
    unit: "",
    barcode: "",
    brand: "",
    manufacturing_date: "",
    expiry_date: "",
    purchase_date: "",
    supplier: "",
    storage_location: "",
    image_url: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  
  const fetchProductByBarcode = async (barcode) => {

  if (!barcode.trim()) return;

  try {

    const product = await getProductByBarcode(barcode);

    setFormData(prev => ({
      ...prev,
      barcode: product.barcode,
      product_name: product.product_name || "",
      brand: product.brand || "",
      category: product.category || "",
      unit: prev.unit || "Packets",
      image_url: product.image || ""
    }));

  } catch (err) {

    console.log(err);

    // Keep barcode but don't clear user's existing values
    setFormData(prev => ({
      ...prev,
      barcode
    }));

  }
};

  useEffect(() => {

    if (location.state?.barcode) {
        fetchProductByBarcode(location.state.barcode);
    }

  }, [location.state]);


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await addInventory(formData);

      alert("Inventory item added successfully!");

      navigate("/inventory");

    } catch (err) {
      console.log(err);
      alert("Failed to add inventory item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          Add Inventory Item
        </h1>


        {formData.image_url && (
          <div className="flex justify-center mb-8">
            <div className="bg-gray-50 rounded-2xl p-4 shadow">
              <img
                src={formData.image_url}
                alt={formData.product_name}
                className="h-44 object-contain"
              />
            </div>
          </div>
 )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          <input
            name="product_name"
            value={formData.product_name}
            placeholder="Product Name"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
            required
          />
          <input
            name="brand"
            value={formData.brand}
            placeholder="Brand"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
          />

          <input
            name="category"
            value={formData.category}
            placeholder="Category"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
            required
          />

          <input
            name="barcode"
            placeholder="Barcode"
            value={formData.barcode}
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
            onBlur={(e) => fetchProductByBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchProductByBarcode(formData.barcode);
              }
            }}
          />

          <input
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
            required
          />

          <select
            name="unit"
            value={formData.unit}
            placeholder="Unit (kg, L, packets)"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
            required
          >
            <option value="">Select Unit</option>
            <option value="packets">Packets</option>
            <option value="kg">Kg</option>
            <option value="g">Grams</option>
            <option value="L">Litres</option>
            <option value="ml">Millilitres</option>
            <option value="pieces">Pieces</option>
            <option value="boxes">Boxes</option>
          </select>

          

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manufacturing Date
            </label>

            <input
                type="date"
                name="manufacturing_date"
                value={formData.manufacturing_date}
                className="border rounded-xl p-4 h-14 w-full"
                onChange={handleChange}
            />
         </div>

         <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date <span className="text-red-500">*</span>
            </label>

            <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                className="border rounded-xl p-4 h-14 w-full"
                onChange={handleChange}
                required
            />
         </div>

         <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase Date
            </label>

            <input
                type="date"
                value={formData.purchase_date}
                name="purchase_date"
                className="border rounded-xl p-4 h-14 w-full"
                onChange={handleChange}
            />
         </div>
         <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Supplier
          </label>
          <input
            name="supplier"
            value={formData.supplier}
            placeholder="Supplier"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
          />
          </div>
          <input
            name="storage_location"
            value={formData.storage_location}
            placeholder="Storage Location"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
          />

          

          <input
            name="image_url"
            value={formData.image_url}
            placeholder="Image URL (optional)"
            className="border rounded-xl p-4 h-14 w-full"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold md:col-span-2"
          >
            {loading ? "Saving..." : "Add Inventory"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}