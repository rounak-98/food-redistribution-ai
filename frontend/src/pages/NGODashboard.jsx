import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/dashboard/StatCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { getNGODashboardStats } from "../services/ngoService";

export default function NGODashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    available: 0,
    accepted: 0,
    completed: 0,
    meals: 0,
    recent_donations: [],
    ai_recommendations: [],
    ngo_profile: null,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getNGODashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching NGO dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              NGO Overview Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time food redistribution metrics & nearby available donations
            </p>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 font-medium transition self-start md:self-auto"
          >
            🔄 Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Available Donations"
                value={dashboardData.available}
                icon="🍱"
                color="text-green-600"
              />
              <StatCard
                title="Accepted Donations"
                value={dashboardData.accepted}
                icon="🤝"
                color="text-blue-600"
              />
              <StatCard
                title="Completed Pickups"
                value={dashboardData.completed}
                icon="✅"
                color="text-purple-600"
              />
              <StatCard
                title="Est. Meals Distributed"
                value={dashboardData.meals}
                icon="🍽️"
                color="text-orange-600"
              />
            </div>

            {/* NGO Location & Address Widget */}
            {dashboardData.ngo_profile && (
              <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">
                    📍 Current Location & Operational Region
                  </div>
                  <h3 className="text-xl font-bold">
                    {dashboardData.ngo_profile.ngo_name}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {dashboardData.ngo_profile.address}, {dashboardData.ngo_profile.city}, {dashboardData.ngo_profile.state} - {dashboardData.ngo_profile.pincode}
                  </p>
                  <p className="text-xs text-blue-200 mt-1">
                    GPS Coordinates: {dashboardData.ngo_profile.latitude && dashboardData.ngo_profile.longitude 
                      ? `${dashboardData.ngo_profile.latitude}, ${dashboardData.ngo_profile.longitude}` 
                      : "Not set (Click edit profile to enable precise distance calculation)"}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/ngo/profile")}
                  className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-sm whitespace-nowrap"
                >
                  ⚙️ Update Location / Profile
                </button>
              </div>
            )}

            {/* Quick Actions Grid */}
            <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-900">
              Quick Navigation
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                title="Browse Donations"
                icon="🍱"
                path="/ngo/donations"
              />
              <QuickActionCard
                title="Accepted List"
                icon="✅"
                path="/ngo/accepted"
              />
              <QuickActionCard
                title="Donation History"
                icon="📜"
                path="/ngo/history"
              />
              <QuickActionCard
                title="NGO Profile"
                icon="👤"
                path="/ngo/profile"
              />
            </div>

            {/* Dynamic AI Cards & Recent Donations */}
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              {/* AI Recommendation Engine */}
              <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    🤖 AI Optimization Insights
                  </h2>
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                    Live Engine
                  </span>
                </div>

                <div className="space-y-4">
                  {dashboardData.ai_recommendations && dashboardData.ai_recommendations.length > 0 ? (
                    dashboardData.ai_recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl flex items-start gap-3 border ${
                          idx % 2 === 0
                            ? "bg-green-50 text-green-900 border-green-200"
                            : "bg-blue-50 text-blue-900 border-blue-200"
                        }`}
                      >
                        <span className="text-xl">💡</span>
                        <p className="text-sm font-medium leading-relaxed">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm">
                      No active AI insights available at the moment.
                    </div>
                  )}
                </div>
              </div>

              {/* Real Recent Available Donations */}
              <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Nearest Available Food
                  </h2>
                  <button
                    onClick={() => navigate("/ngo/donations")}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    View All →
                  </button>
                </div>

                {dashboardData.recent_donations && dashboardData.recent_donations.length > 0 ? (
                  <ul className="space-y-4">
                    {dashboardData.recent_donations.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => navigate(`/ngo/donation-details/${item.id}`)}
                        className="flex items-center justify-between p-3.5 border rounded-xl hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            🍱 {item.food_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Donor: {item.business_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-gray-800">
                            {item.quantity}
                          </p>
                          <span className="text-xs text-blue-600 font-medium">
                            {item.distance_km ? `${item.distance_km} km away` : "Nearby"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-3xl mb-2">🍃</p>
                    <p className="text-sm font-medium">No available food donations listed right now.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </NGODashboardLayout>
  );
}