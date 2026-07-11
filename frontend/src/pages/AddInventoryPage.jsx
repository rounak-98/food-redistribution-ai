import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { addInventory } from "../services/inventoryService";

export default function AddInventoryPage() {
  const navigate = useNavigate();

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

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          <input
            name="product_name"
            placeholder="Product Name"
            className="border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            className="border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <input
            name="quantity"
            placeholder="Quantity"
            className="border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <input
            name="unit"
            placeholder="Unit (kg, L, packets)"
            className="border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <input
            name="barcode"
            placeholder="Barcode"
            className="border rounded-xl p-4"
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manufacturing Date
            </label>

            <input
                type="date"
                name="manufacturing_date"
                className="border rounded-xl p-4 w-full"
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
                className="border rounded-xl p-4 w-full"
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
                name="purchase_date"
                className="border rounded-xl p-4 w-full"
                onChange={handleChange}
            />
         </div>

          <input
            name="supplier"
            placeholder="Supplier"
            className="border rounded-xl p-4"
            onChange={handleChange}
          />

          <input
            name="storage_location"
            placeholder="Storage Location"
            className="border rounded-xl p-4"
            onChange={handleChange}
          />

          <input
            name="image_url"
            placeholder="Image URL (optional)"
            className="border rounded-xl p-4 md:col-span-2"
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