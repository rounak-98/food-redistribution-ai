import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerVolunteer } from "../services/volunteerService";

export default function VolunteerRegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicle_type: "Bike",
    vehicle_number: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        alert("Unable to detect GPS position. Please enter manually.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await registerVolunteer(formData);
      alert("Volunteer Rider registration successful! Please log in to accept delivery requests.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
            🛵
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Volunteer & Rider Registration
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Join FoodBridge AI as a logistics rider to pick up food from donors and deliver to local NGOs.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-medium mb-6 border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Vikram Singh"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Vehicle Type *
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Motorcycle / Bike">🛵 Motorcycle / Scooter</option>
                <option value="Bicycle">🚲 Bicycle</option>
                <option value="Car / Sedan">🚗 Car / SUV</option>
                <option value="Delivery Van">🚐 Delivery Van / Auto</option>
                <option value="Electric Vehicle">⚡ Electric Vehicle (EV)</option>
                <option value="On Foot">🚶 On Foot (Local Neighborhood)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Vehicle License Plate / ID
              </label>
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                placeholder="e.g. KA-01-AB-1234"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Operating City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GPS Auto Detect */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                📍 GPS Coordinates (For Nearby Rider Dispatch)
              </span>
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition"
              >
                {detectingLocation ? "Locating..." : "🎯 Detect Location"}
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-4 rounded-xl transition shadow-lg text-base"
          >
            {loading ? "Registering..." : "Join as Transport Volunteer"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-amber-600 font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}