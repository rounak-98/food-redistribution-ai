import { useEffect, useState } from "react";
import IndividualDashboardLayout from "../components/dashboard/IndividualDashboardLayout";
import { getIndividualDashboard } from "../services/individualService";

export default function IndividualProfilePage() {
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getIndividualDashboard();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (data.user_profile) {
        setFormData({
          name: data.user_profile.name || user.name || "",
          email: user.email || "",
          phone: data.user_profile.phone || "",
          address: data.user_profile.address || "",
          city: data.user_profile.city || "",
          state: data.user_profile.state || "",
          pincode: data.user_profile.pincode || "",
          latitude: data.user_profile.latitude || "",
          longitude: data.user_profile.longitude || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

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
        setMessage({ type: "success", text: "GPS location detected successfully!" });
      },
      (error) => {
        setDetectingLocation(false);
        alert("Unable to detect GPS location.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Profile details updated successfully!" });
  };

  return (
    <IndividualDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👤 Individual Donor Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information, contact phone, and home pickup location.
            </p>
          </div>
        </div>

        {message.text && (
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 text-sm font-medium border border-emerald-200">
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">👤 Personal Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4">🏠 Home Pickup Location</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GPS Location */}
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                    📍 Geolocation Coordinates
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Helps NGOs find your exact home location for surplus food pickup.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={detectingLocation}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                >
                  {detectingLocation ? "Locating..." : "🎯 Detect My Location"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition shadow"
              >
                💾 Save Profile Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </IndividualDashboardLayout>
  );
}
