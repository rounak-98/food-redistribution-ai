import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StatCard from "../components/dashboard/StatCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import LiveMapWidget from "../components/dashboard/LiveMapWidget";
import { getNGODashboardStats } from "../services/ngoService";

export default function NGODashboard() {
  const { t } = useTranslation();
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

  const ngoProfile = dashboardData.ngo_profile;

  const ngoLocations = [
    {
      id: "ngo-self",
      name: ngoProfile?.ngo_name || "Your NGO Shelter",
      type: "ngo",
      lat: ngoProfile?.latitude || 12.9800,
      lng: ngoProfile?.longitude || 77.6050,
      address: ngoProfile?.address || "Brigade Road, Bengaluru",
      phone: ngoProfile?.phone || "NGO Contact",
      details: "🤝 Verified Recipient Shelter",
    },
    {
      id: "donor-nearby-1",
      name: "Royal Palace Hotel & Bakery",
      type: "business",
      lat: 12.9716,
      lng: 77.5946,
      address: "12 MG Road, Indiranagar",
      phone: "+91 98765 43210",
      details: "🍱 Available: 50 Portions Cooked Biryani",
    },
    {
      id: "rider-dispatch-1",
      name: "Logistics Rider",
      type: "rider",
      lat: 12.9750,
      lng: 77.6000,
      address: "En Route to NGO",
      phone: "+91 99887 76655",
      details: "🛵 Active Delivery Rider",
    },
  ];

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {t("app_name")} - {t("roles.ngo")} Dashboard
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Real-time food redistribution metrics & nearby available donations
            </p>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 text-xs sm:text-sm px-4 py-2 rounded-xl hover:bg-blue-100 font-bold transition self-start md:self-auto border border-blue-200"
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
            {/* Stats Overview Grid - 2 cards per row on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard
                title={t("kpi.available_donations")}
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
                title={t("kpi.completed_pickups")}
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
            {ngoProfile && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
                    📍 Current Location & Operational Region
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {ngoProfile.ngo_name}
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1">
                    {ngoProfile.address}, {ngoProfile.city}, {ngoProfile.state} - {ngoProfile.pincode}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/ngo/profile")}
                  className="bg-white text-blue-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-50 transition shadow-sm whitespace-nowrap"
                >
                  ⚙️ Update Profile
                </button>
              </div>
            )}

            {/* Live GIS Map Component */}
            <LiveMapWidget
              title={t("cards.gis_map")}
              locations={ngoLocations}
              height="380px"
            />

            {/* Quick Actions Grid - 2 cards per row on mobile */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 text-gray-900">
                {t("kpi.quick_actions")}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  title={t("actions.history")}
                  icon="📜"
                  path="/ngo/history"
                />
                <QuickActionCard
                  title={t("nav.profile")}
                  icon="👤"
                  path="/ngo/profile"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </NGODashboardLayout>
  );
}