import { useEffect, useState } from "react";
import VolunteerDashboardLayout from "../components/dashboard/VolunteerDashboardLayout";
import {
  getVolunteerDashboard,
  toggleVolunteerOnlineStatus,
  acceptDeliveryTask,
  updateDeliveryTaskStatus,
} from "../services/volunteerService";

export default function VolunteerDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("immediate"); // "immediate" or "scheduled"
  const [actionLoading, setActionLoading] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    volunteer: {},
    stats: { deliveries_completed: 0, total_distance_km: 0, hours_volunteered: 0, karma_points: 0 },
    active_delivery: null,
    available_requests: [],
    scheduled_deliveries: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getVolunteerDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading volunteer dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    try {
      const res = await toggleVolunteerOnlineStatus();
      setDashboardData((prev) => ({
        ...prev,
        volunteer: { ...prev.volunteer, is_online: res.is_online },
      }));
    } catch (err) {
      console.error("Failed to toggle online status:", err);
    }
  };

  const handleAcceptTask = async (donationId) => {
    try {
      setActionLoading(donationId);
      const res = await acceptDeliveryTask(donationId);
      alert(res.message);
      loadDashboard();
    } catch (err) {
      console.error("Error accepting task:", err);
      alert(err.response?.data?.detail || "Failed to accept task.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (donationId, status) => {
    try {
      setActionLoading(donationId);
      const res = await updateDeliveryTaskStatus(donationId, status);
      alert(res.message);
      loadDashboard();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const active = dashboardData.active_delivery;
  const vol = dashboardData.volunteer;

  return (
    <VolunteerDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {/* Header Banner & Online Toggle */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    🛵 Verified Transport Rider
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Vehicle: {vol.vehicle_type || "Bike"}</span>
                </div>

                <h1 className="text-3xl font-bold">
                  Welcome back, {vol.full_name || "Volunteer Rider"} 👋
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Connecting local food donors (Businesses & Households) with registered NGOs across {vol.city || "your region"}.
                </p>
              </div>

              {/* Online / Offline Toggle */}
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex items-center gap-4 self-start md:self-auto">
                <div>
                  <p className="text-xs font-bold text-slate-300">Rider Dispatch Status</p>
                  <p className={`text-xs font-extrabold ${vol.is_online ? "text-emerald-400" : "text-rose-400"}`}>
                    {vol.is_online ? "🟢 Online & Ready for Orders" : "🔴 Offline (Paused)"}
                  </p>
                </div>

                <button
                  onClick={handleToggleOnline}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                    vol.is_online
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {vol.is_online ? "Go Offline" : "Go Online"}
                </button>
              </div>
            </div>

            {/* Rider Performance KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">🚚</div>
                <p className="text-xs font-semibold text-gray-500">Deliveries Completed</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                  {dashboardData.stats.deliveries_completed}
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">🗺️</div>
                <p className="text-xs font-semibold text-gray-500">Distance Covered</p>
                <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
                  {dashboardData.stats.total_distance_km} km
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">⏱️</div>
                <p className="text-xs font-semibold text-gray-500">Hours Volunteered</p>
                <h3 className="text-2xl font-extrabold text-purple-600 mt-1">
                  {dashboardData.stats.hours_volunteered} hrs
                </h3>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-xs font-semibold text-gray-500">Logistics Karma Points</p>
                <h3 className="text-2xl font-extrabold text-amber-500 mt-1">
                  {dashboardData.stats.karma_points} XP
                </h3>
              </div>
            </div>

            {/* ACTIVE IN-PROGRESS DELIVERY STEPPER (IF ANY) */}
            {active && (
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl mb-10 border border-blue-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      ● Active Delivery In Progress
                    </span>
                    <span className="text-xs text-blue-200">Task ID: #{active.task_id}</span>
                  </div>
                  <span className="bg-blue-800 text-blue-100 text-xs px-3 py-1 rounded-lg font-mono">
                    {active.delivery_type}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Pickup Info */}
                  <div className="bg-blue-950/60 p-5 rounded-2xl border border-blue-800/80">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                      📍 1. Pickup Location (Donor)
                    </p>
                    <h4 className="text-lg font-bold text-white">🍱 {active.food_name}</h4>
                    <p className="text-xs text-blue-200 mt-1 font-semibold">Quantity: {active.quantity}</p>
                    <p className="text-sm font-semibold text-gray-200 mt-3">{active.pickup_address}</p>
                    <p className="text-xs text-blue-300 mt-1">
                      Contact: {active.pickup_contact_name} • 📞 {active.pickup_phone}
                    </p>
                  </div>

                  {/* Dropoff Info */}
                  <div className="bg-blue-950/60 p-5 rounded-2xl border border-blue-800/80">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                      🏁 2. Dropoff Destination (NGO)
                    </p>
                    <h4 className="text-lg font-bold text-white">🏢 {active.dropoff_ngo_name}</h4>
                    <p className="text-sm font-semibold text-gray-200 mt-3">{active.dropoff_address}</p>
                    <p className="text-xs text-blue-300 mt-1">
                      NGO Contact Phone: 📞 {active.dropoff_phone}
                    </p>
                  </div>
                </div>

                {/* Status Update Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-blue-800">
                  <p className="text-xs text-blue-200 font-semibold">
                    Current Status: <span className="text-amber-300 font-bold uppercase">{active.status}</span>
                  </p>

                  <div className="flex items-center gap-3">
                    {active.status === "Accepted" && (
                      <button
                        onClick={() => handleUpdateStatus(active.donation_id, "In_Transit")}
                        disabled={actionLoading === active.donation_id}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
                      >
                        🚚 Picked Up & En Route to NGO
                      </button>
                    )}

                    {active.status === "In_Transit" && (
                      <button
                        onClick={() => handleUpdateStatus(active.donation_id, "Delivered")}
                        disabled={actionLoading === active.donation_id}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow"
                      >
                        🎉 Confirm Handover & Complete Delivery
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(active.donation_id, "Rejected")}
                      className="bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition"
                    >
                      Decline Delivery
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Requests Navigation Tabs */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("immediate")}
                  className={`text-lg font-bold pb-2 transition border-b-2 ${
                    activeTab === "immediate"
                      ? "border-amber-500 text-gray-900 font-extrabold"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  ⚡ Urgent Delivery Requests ({dashboardData.available_requests.length})
                </button>

                <button
                  onClick={() => setActiveTab("scheduled")}
                  className={`text-lg font-bold pb-2 transition border-b-2 ${
                    activeTab === "scheduled"
                      ? "border-amber-500 text-gray-900 font-extrabold"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  📅 Scheduled Pickups ({dashboardData.scheduled_deliveries.length})
                </button>
              </div>

              <button
                onClick={loadDashboard}
                className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition"
              >
                🔄 Refresh Orders
              </button>
            </div>

            {/* IMMEDIATE URGENT REQUESTS LIST */}
            {activeTab === "immediate" && (
              <div className="space-y-6">
                {!vol.is_online && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm font-medium flex items-center justify-between">
                    <span>⚠️ You are currently offline. Switch your status to Online to accept nearby delivery orders.</span>
                    <button
                      onClick={handleToggleOnline}
                      className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      Go Online Now
                    </button>
                  </div>
                )}

                {dashboardData.available_requests.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <p className="text-5xl mb-4">📦</p>
                    <h3 className="text-xl font-bold text-gray-800">No pending delivery requests nearby</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                      New delivery orders will appear here automatically when food donors and NGOs match!
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {dashboardData.available_requests.map((req) => (
                      <div
                        key={req.donation_id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-amber-400 transition space-y-4"
                      >
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-extrabold text-gray-900 text-lg">🍱 {req.food_name}</p>
                            <p className="text-xs text-gray-500">Category: {req.food_category} • {req.quantity}</p>
                          </div>
                          <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
                            📍 {req.distance_km} km away
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <div>
                            <strong className="text-gray-900 block">📍 Pickup (Donor):</strong>
                            <p className="text-gray-700 font-medium">{req.donor_name} — {req.pickup_address}</p>
                            <p className="text-gray-400">📞 Phone: {req.pickup_phone}</p>
                          </div>

                          <div className="pt-2">
                            <strong className="text-gray-900 block">🏁 Dropoff (NGO Destination):</strong>
                            <p className="text-gray-700 font-medium">{req.dropoff_ngo_name} — {req.dropoff_address}</p>
                            <p className="text-gray-400">📞 NGO Phone: {req.dropoff_phone}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t gap-3">
                          <span className="text-xs text-orange-600 font-bold">
                            ⏰ {req.pickup_time}
                          </span>

                          <button
                            onClick={() => handleAcceptTask(req.donation_id)}
                            disabled={!vol.is_online || actionLoading === req.donation_id}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition"
                          >
                            {actionLoading === req.donation_id ? "Accepting..." : "⚡ Accept Delivery Task"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SCHEDULED DELIVERIES LIST */}
            {activeTab === "scheduled" && (
              <div className="space-y-6">
                {dashboardData.scheduled_deliveries.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <p className="text-5xl mb-4">📅</p>
                    <h3 className="text-xl font-bold text-gray-800">No scheduled advance pickups</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                      Advance bakery surplus or event pickups scheduled for tomorrow will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {dashboardData.scheduled_deliveries.map((req) => (
                      <div
                        key={req.donation_id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4"
                      >
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-extrabold text-gray-900 text-lg">🍱 {req.food_name}</p>
                            <p className="text-xs text-gray-500">{req.quantity} • Scheduled Delivery</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                            🗓️ Advance Pickup
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <p><strong className="text-gray-900">Donor:</strong> {req.donor_name} ({req.pickup_address})</p>
                          <p><strong className="text-gray-900">Destination:</strong> {req.dropoff_ngo_name} ({req.dropoff_address})</p>
                          <p className="text-orange-600 font-bold">⏰ Scheduled: {req.pickup_time}</p>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleAcceptTask(req.donation_id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                          >
                            📅 Reserve Scheduled Delivery
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </VolunteerDashboardLayout>
  );
}