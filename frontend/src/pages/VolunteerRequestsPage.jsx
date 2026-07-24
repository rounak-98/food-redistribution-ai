import { useEffect, useState } from "react";
import VolunteerDashboardLayout from "../components/dashboard/VolunteerDashboardLayout";
import {
  getVolunteerDashboard,
  acceptDeliveryTask,
  toggleVolunteerOnlineStatus,
} from "../services/volunteerService";

export default function VolunteerRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    volunteer: {},
    available_requests: [],
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getVolunteerDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Error loading delivery requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (donationId) => {
    try {
      setActionLoading(donationId);
      const res = await acceptDeliveryTask(donationId);
      alert(res.message);
      loadRequests();
    } catch (err) {
      console.error("Failed to accept delivery task:", err);
      alert("Failed to accept delivery task.");
    } finally {
      setActionLoading(null);
    }
  };

  const vol = dashboardData.volunteer || {};
  const requests = dashboardData.available_requests || [];

  return (
    <VolunteerDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📦 Available Delivery Orders</h1>
            <p className="text-gray-600 mt-1">
              Active food pickup orders waiting for nearby logistics transport riders.
            </p>
          </div>

          <button
            onClick={loadRequests}
            className="bg-amber-50 text-amber-900 font-bold px-4 py-2 rounded-xl hover:bg-amber-100 transition self-start md:self-auto text-sm border border-amber-200"
          >
            🔄 Refresh Orders
          </button>
        </div>

        {!vol.is_online && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm font-medium mb-6 flex items-center justify-between">
            <span>⚠️ You are currently offline. Switch your status to Online to accept delivery orders.</span>
            <button
              onClick={async () => {
                await toggleVolunteerOnlineStatus();
                loadRequests();
              }}
              className="bg-amber-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl"
            >
              Go Online Now
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="text-xl font-bold text-gray-800">No active delivery requests right now</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Check back soon as businesses and households post surplus food for nearby NGO collection!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req.donation_id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-amber-400 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <div>
                      <p className="font-extrabold text-gray-900 text-lg">🍱 {req.food_name}</p>
                      <p className="text-xs text-gray-500">Quantity: {req.quantity} • {req.food_category}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
                      📍 {req.distance_km} km away
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-gray-600 bg-slate-50 p-4 rounded-xl">
                    <div>
                      <strong className="text-gray-900 block font-bold">📍 1. Pickup Donor Address:</strong>
                      <p className="text-gray-800 font-semibold">{req.donor_name} — {req.pickup_address}</p>
                      <p className="text-gray-400">📞 Phone: {req.pickup_phone}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <strong className="text-gray-900 block font-bold">🏁 2. NGO Dropoff Location:</strong>
                      <p className="text-gray-800 font-semibold">{req.dropoff_ngo_name} — {req.dropoff_address}</p>
                      <p className="text-gray-400">📞 NGO Contact: {req.dropoff_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t gap-3">
                  <span className="text-xs text-orange-600 font-bold">⏰ {req.pickup_time}</span>
                  <button
                    onClick={() => handleAccept(req.donation_id)}
                    disabled={!vol.is_online || actionLoading === req.donation_id}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition"
                  >
                    {actionLoading === req.donation_id ? "Accepting..." : "⚡ Accept Delivery Order"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VolunteerDashboardLayout>
  );
}
