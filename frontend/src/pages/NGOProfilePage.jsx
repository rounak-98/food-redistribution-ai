import { useState, useEffect } from "react";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { getNGOProfile, updateNGOProfile } from "../services/ngoService";

export default function NGOProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    ngo_name: "",
    registration_number: "",
    contact_person: "",
    phone: "",
    email: "",
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
      const data = await getNGOProfile();
      setFormData({
        ngo_name: data.ngo_name || "",
        registration_number: data.registration_number || "",
        contact_person: data.contact_person || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
      });
    } catch (error) {
      console.error("Failed to load NGO profile:", error);
      setMessage({ type: "error", text: "Failed to load profile information." });
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
      setMessage({
        type: "error",
        text: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setDetectingLocation(true);
    setMessage({ type: "", text: "" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setDetectingLocation(false);
        setMessage({
          type: "success",
          text: `Detected GPS location successfully! (${lat}, ${lng})`,
        });
      },
      (error) => {
        setDetectingLocation(false);
        console.error("Geolocation error:", error);
        setMessage({
          type: "error",
          text: "Unable to retrieve GPS position. Please allow location permissions or enter coordinates manually.",
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await updateNGOProfile(formData);
      setMessage({ type: "success", text: "NGO Profile updated successfully!" });
      
      // Update localStorage profile if needed
      const storedProfile = JSON.parse(localStorage.getItem("profile") || "{}");
      localStorage.setItem(
        "profile",
        JSON.stringify({ ...storedProfile, ...result.profile })
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <NGODashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👤 NGO Profile & Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your organization details, contact info, and operational GPS location.
            </p>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 space-y-6">
            {/* Organization Info */}
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">
              🏢 Organization Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NGO Name *
                </label>
                <input
                  type="text"
                  name="ngo_name"
                  value={formData.ngo_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Person & Communications */}
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4">
              📞 Contact Details
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Address Details */}
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4">
              🏠 Operating Address
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GPS Location & Coordinates */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    📍 Geolocation Coordinates
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Used for calculating accurate distance (km) to nearby food donors.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={detectingLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-2"
                >
                  {detectingLocation ? "⏳ Locating..." : "🎯 Detect My GPS Location"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 12.971598"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 77.594566"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md flex items-center gap-2"
              >
                {saving ? "Saving Changes..." : "💾 Save NGO Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </NGODashboardLayout>
  );
}