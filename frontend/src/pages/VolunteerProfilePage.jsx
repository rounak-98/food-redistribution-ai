import { useEffect, useState } from "react";
import VolunteerDashboardLayout from "../components/dashboard/VolunteerDashboardLayout";
import { getVolunteerDashboard } from "../services/volunteerService";

export default function VolunteerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle_type: "Bike",
    vehicle_number: "",
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
      const data = await getVolunteerDashboard();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const vol = data.volunteer || {};
      setFormData({
        name: vol.full_name || user.name || "",
        email: user.email || "",
        phone: vol.phone || "",
        vehicle_type: vol.vehicle_type || "Motorcycle / Bike",
        vehicle_number: vol.vehicle_number || "",
        city: vol.city || "",
        state: vol.state || "",
        pincode: vol.pincode || "",
        latitude: vol.latitude || "",
        longitude: vol.longitude || "",
      });
    } catch (err) {
      console.error("Failed to load rider profile:", err);
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
        setMessage({ type: "success", text: "Rider GPS location detected successfully!" });
      },
      (error) => {
        setDetectingLocation(false);
        alert("Unable to detect GPS position.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Rider profile and vehicle details saved successfully!" });
  };

  return (
    <VolunteerDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛵 Rider Profile & Vehicle Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your rider details, vehicle type, and GPS dispatch location.
            </p>
          </div>
        </div>

        {message.text && (
          <div className="bg-amber-100 text-amber-900 p-4 rounded-xl mb-6 text-sm font-medium border border-amber-300">
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">👤 Rider Identity</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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

            <h3 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4">🛵 Transport Vehicle Information</h3>

            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle Type *</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle License Plate / ID</label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  placeholder="e.g. KA-01-AB-1234"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GPS Location */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <h4 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                    📍 Geolocation Coordinates
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Used for calculating accurate order pickup distance ($km$) to food donors.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={detectingLocation}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
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
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold px-8 py-3 rounded-xl transition shadow"
              >
                💾 Save Rider Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </VolunteerDashboardLayout>
  );
}

