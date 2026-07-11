import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createDonation } from "../../services/donationService";

export default function DonationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const inventoryItem = location.state?.inventoryItem;

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const businessId = storedUser?.business?.id;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    business_id: businessId,

    food_name: inventoryItem?.product_name || "",

    food_category: inventoryItem?.category || "",

    quantity: inventoryItem
        ? `${inventoryItem.quantity} ${inventoryItem.unit}`
        : "",

    manufacturing_date:
        inventoryItem?.manufacturing_date || "",

    expiry_date:
        inventoryItem?.expiry_date || "",

    pickup_address: "",

    pickup_time: "",

    contact_person: "",

    phone: "",

    special_instructions: "",

    image_url: inventoryItem?.image_url || "",
});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await createDonation(formData);

      setMessage("Donation added successfully!");

      setTimeout(() => {
        navigate("/dashboard/business");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add donation.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        <input
          name="food_name"
          placeholder="Food Name"
          className="border rounded-xl p-4"
          value={formData.food_name}
          onChange={handleChange}
          required
        />

        <input
          name="food_category"
          placeholder="Food Category"
          className="border rounded-xl p-4"
          value={formData.food_category}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          placeholder="Quantity"
          className="border rounded-xl p-4"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="manufacturing_date"
          className="border rounded-xl p-4"
          value={formData.manufacturing_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="expiry_date"
          className="border rounded-xl p-4"
          value={formData.expiry_date}
          onChange={handleChange}
          required
        />

        <input
          name="pickup_time"
          placeholder="Pickup Time"
          className="border rounded-xl p-4"
          value={formData.pickup_time}
          onChange={handleChange}
          required
        />

        <input
          name="contact_person"
          placeholder="Contact Person"
          className="border rounded-xl p-4"
          value={formData.contact_person}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          className="border rounded-xl p-4"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          name="pickup_address"
          placeholder="Pickup Address"
          className="border rounded-xl p-4 md:col-span-2"
          value={formData.pickup_address}
          onChange={handleChange}
          required
        />

        <textarea
          name="special_instructions"
          placeholder="Special Instructions"
          className="border rounded-xl p-4 md:col-span-2"
          rows="4"
          value={formData.special_instructions}
          onChange={handleChange}
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Submit Donation"}
      </button>

    </form>
  );
}