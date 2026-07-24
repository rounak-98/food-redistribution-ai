import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerBusiness } from "../../services/authService";

export default function BusinessForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    business_name: "",
    business_type: "",
    owner_name: "",
    fssai_number: "",
    gst_number: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));

        alert("Location captured successfully!");
      },
      (error) => {
        alert("Unable to get location.");
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerBusiness({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "business",
        business_name: formData.business_name,
        business_type: formData.business_type,
        owner_name: formData.owner_name,
        fssai_number: formData.fssai_number,
        gst_number: formData.gst_number,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 p-4 rounded-xl">{message}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <input name="name" placeholder="Full Name" className="border rounded-xl p-4" value={formData.name} onChange={handleChange} required />
        <input name="business_name" placeholder="Business Name" className="border rounded-xl p-4" value={formData.business_name} onChange={handleChange} required />

        <select name="business_type" className="border rounded-xl p-4" value={formData.business_type} onChange={handleChange} required>
          <option value="">Select Business Type</option>
          <option>Restaurant</option>
          <option>Hotel</option>
          <option>Bakery</option>
          <option>Supermarket</option>
          <option>Cloud Kitchen</option>
          <option>Catering Service</option>
          <option>Cafe</option>
          <option>Sweet Shop</option>
          <option>Hostel / Mess</option>
          <option>College Canteen</option>
        </select>

        <input name="owner_name" placeholder="Owner / Manager Name" className="border rounded-xl p-4" value={formData.owner_name} onChange={handleChange} required />
        <input name="fssai_number" placeholder="FSSAI Number" className="border rounded-xl p-4" value={formData.fssai_number} onChange={handleChange} />
        <input name="gst_number" placeholder="GST Number" className="border rounded-xl p-4" value={formData.gst_number} onChange={handleChange} />

        <input type="email" name="email" placeholder="Email" className="border rounded-xl p-4" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" className="border rounded-xl p-4" value={formData.phone} onChange={handleChange} required />
        <input name="address" placeholder="Address" className="border rounded-xl p-4 md:col-span-2" value={formData.address} onChange={handleChange} required />
        <input name="city" placeholder="City" className="border rounded-xl p-4" value={formData.city} onChange={handleChange} required />
        <input name="state" placeholder="State" className="border rounded-xl p-4" value={formData.state} onChange={handleChange} required />
        <input name="pincode" placeholder="Pincode" className="border rounded-xl p-4" value={formData.pincode} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Password" className="border rounded-xl p-4" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" className="border rounded-xl p-4" value={formData.confirmPassword} onChange={handleChange} required />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-4">

        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold"
        >
          📍 Use Current Location
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <Link
          to="/login"
          className="text-green-700 font-semibold hover:underline"
        >
          Already have an account? Login
        </Link>

      </div>
    </form>
  );
}
