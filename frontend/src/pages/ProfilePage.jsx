import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getBusinessProfile, updateBusinessProfile } from "../services/authService";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    owner_name: "",
    fssai_number: "",
    gst_number: "",
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
      const data = await getBusinessProfile();
      setFormData({
        business_name: data.business_name || "",
        business_type: data.business_type || "Restaurant",
        owner_name: data.owner_name || "",
        fssai_number: data.fssai_number || "",
        gst_number: data.gst_number || "",
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
      console.error("Failed to load business profile:", error);
      // Fallback to local storage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const profile = JSON.parse(localStorage.getItem("profile") || "{}");
      setFormData((prev) => ({
        ...prev,
        business_name: profile.business_name || "",
        owner_name: profile.owner_name || "",
        phone: profile.phone || "",
        email: user.email || "",
        city: profile.city || "",
        state: profile.state || "",
      }));
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
          text: `GPS Location detected! (${lat}, ${lng})`,
        });
      },
      (error) => {
        setDetectingLocation(false);
        console.error("Geolocation error:", error);
        setMessage({
          type: "error",
          text: "Unable to retrieve GPS coordinates.",
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
      const result = await updateBusinessProfile(formData);
      setMessage({ type: "success", text: "Business Profile updated successfully!" });
      setIsEditing(false);

      // Sync local storage profile
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏢 Business Profile & Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your food business details, FSSAI compliance, and pickup GPS location.
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 rounded-xl font-bold transition shadow-sm ${
              isEditing
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEditing ? "✕ Cancel Editing" : "✏️ Edit Profile"}
          </button>
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
        ) : isEditing ? (
          /* EDITABLE FORM MODE */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">
              🏢 Business Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel / Resort">Hotel / Resort</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Bakery / Cafe">Bakery / Cafe</option>
                  <option value="Catering Service">Catering Service</option>
                  <option value="Food Distributor">Food Distributor</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  FSSAI License Number
                </label>
                <input
                  type="text"
                  name="fssai_number"
                  value={formData.fssai_number}
                  onChange={handleChange}
                  placeholder="14-digit FSSAI No."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="GSTIN"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4">
              📞 Contact Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
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

            <h3 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4">
              🏠 Location & Pickup Address
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

            {/* GPS Coordinates Detection */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    📍 GPS Coordinates (For NGO Pickup Proximity)
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Helps NGOs find your exact pickup location for surplus food collection.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={detectingLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-2"
                >
                  {detectingLocation ? "⏳ Locating..." : "🎯 Detect My Location"}
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
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md"
              >
                {saving ? "Saving Profile..." : "💾 Save Business Profile"}
              </button>
            </div>
          </form>
        ) : (
          /* DISPLAY READ-ONLY MODE */
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                🏢 Business Information
              </h2>

              <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                <p>
                  <strong className="text-gray-900">Business Name:</strong>{" "}
                  <span className="font-semibold text-blue-600">{formData.business_name || "N/A"}</span>
                </p>
                <p>
                  <strong className="text-gray-900">Business Type:</strong>{" "}
                  <span>{formData.business_type || "N/A"}</span>
                </p>
                <p>
                  <strong className="text-gray-900">Owner / Manager:</strong>{" "}
                  <span>{formData.owner_name || "N/A"}</span>
                </p>
                <p>
                  <strong className="text-gray-900">FSSAI Number:</strong>{" "}
                  <span>{formData.fssai_number || "Not provided"}</span>
                </p>
                <p>
                  <strong className="text-gray-900">GST Number:</strong>{" "}
                  <span>{formData.gst_number || "Not provided"}</span>
                </p>
                <p>
                  <strong className="text-gray-900">Status:</strong>{" "}
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">
                    🟢 Active Verified Donor
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                🏠 Contact & Location
              </h2>

              <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                <p>
                  <strong className="text-gray-900">Phone:</strong> {formData.phone || "N/A"}
                </p>
                <p>
                  <strong className="text-gray-900">Email:</strong> {formData.email || "N/A"}
                </p>
                <p className="md:col-span-2">
                  <strong className="text-gray-900">Pickup Address:</strong>{" "}
                  {formData.address ? `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}` : "N/A"}
                </p>
                <p className="md:col-span-2 text-sm text-gray-500">
                  <strong className="text-gray-900">GPS Coordinates:</strong>{" "}
                  {formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : "Not set"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}