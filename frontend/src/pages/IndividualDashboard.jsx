import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IndividualDashboardLayout from "../components/dashboard/IndividualDashboardLayout";
import LiveMapWidget from "../components/dashboard/LiveMapWidget";
import { getIndividualDashboard, postIndividualDonation } from "../services/individualService";
import QuickActionCard from "../components/dashboard/QuickActionCard";

export default function IndividualDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    user_profile: {},
    stats: { total_donations_posted: 0, meals_contributed: 0, co2_saved_kg: 0, hero_points: 0 },
    badges: [],
    my_donations: [],
    nearby_ngos: []
  });

  const [donationForm, setDonationForm] = useState({
    food_name: "",
    food_category: "Home Cooked Meal",
    quantity: "5 portions",
    expiry_date: "Today before 9 PM",
    pickup_address: "",
    pickup_time: "Today (Flexible Window)",
    phone: "",
    special_instructions: "Fresh excess home food prepared today. Cleanly packed.",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getIndividualDashboard();
      setDashboardData(data);
      if (data.user_profile) {
        setDonationForm((prev) => ({
          ...prev,
          pickup_address: data.user_profile.address || "",
          phone: data.user_profile.phone || "",
        }));
      }
    } catch (error) {
      console.error("Failed to load individual dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDonation = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const result = await postIndividualDonation(donationForm);
      alert(result.message);
      setIsModalOpen(false);
      loadDashboard();
    } catch (err) {
      console.error("Error posting donation:", err);
      alert("Failed to post donation. Please check details.");
    } finally {
      setPosting(false);
    }
  };

  const indProfile = dashboardData.user_profile;

  const indLocations = [
    {
      id: "ind-self",
      name: indProfile?.name || "Your Household",
      type: "individual",
      lat: indProfile?.latitude || 12.9650,
      lng: indProfile?.longitude || 77.5900,
      address: indProfile?.address || "Koramangala, Bengaluru",
      phone: indProfile?.phone || "Your Contact Number",
      details: "👤 Household Food Donor",
    },
    {
      id: "ngo-center-1",
      name: "Asha Food Shelter & Care",
      type: "ngo",
      lat: 12.9800,
      lng: 77.6050,
      address: "45 Brigade Road, Bengaluru",
      phone: "+91 91234 56789",
      details: "🤝 Verified Recipient Shelter (1.8 km)",
    },
    {
      id: "rider-pickup-1",
      name: "Volunteer Pickup Rider",
      type: "rider",
      lat: 12.9750,
      lng: 77.6000,
      address: "Nearby volunteer on route",
      phone: "+91 99887 76655",
      details: "🛵 Active Logistics Rider",
    },
  ];

  return (
    <IndividualDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <>
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-block bg-white/20 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                  🌱 {t("roles.individual")}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  {t("welcome_back")}, {indProfile?.name || "Community Member"} 👋
                </h2>
                <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                  Share excess home food, event surplus, or grocery items with local food banks and NGOs nearby!
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg transition transform hover:scale-105 whitespace-nowrap self-start md:self-auto"
              >
                ➕ {t("actions.post_surplus")}
              </button>
            </div>

            {/* Impact Metric Cards Grid - 2 cards per row on mobile */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 sm:mb-6">{t("dashboards.personal_impact")}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📦</div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">{t("dashboards.donations_posted")}</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                    {dashboardData.stats.total_donations_posted}
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🍽️</div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">{t("dashboards.meals_contributed")}</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-teal-600 mt-1">
                    {dashboardData.stats.meals_contributed}
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌍</div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">{t("kpi.co2_avoided")}</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
                    {dashboardData.stats.co2_saved_kg}
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⭐</div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">{t("dashboards.hero_points")}</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-amber-500 mt-1">
                    {dashboardData.stats.hero_points} XP
                  </h3>
                </div>
              </div>
            </div>

            {/* GIS Live Map Widget */}
            <LiveMapWidget
              title={t("cards.gis_map")}
              locations={indLocations}
              height="380px"
            />

            {/* Quick Actions Grid - 2 cards per row on mobile */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 sm:mb-6">{t("kpi.quick_actions")}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <QuickActionCard
                  title={t("actions.post_surplus")}
                  icon="➕"
                  onClick={() => setIsModalOpen(true)}
                />
                <QuickActionCard
                  title={t("nav.my_donations")}
                  icon="🍱"
                  path="/individual/donations"
                />
                <QuickActionCard
                  title={t("nav.nearby_ngos")}
                  icon="🤝"
                  path="/individual/ngos"
                />
                <QuickActionCard
                  title={t("nav.badges_rewards")}
                  icon="🏆"
                  path="/individual/badges"
                />
              </div>
            </div>

            {/* Community Badges Grid */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🏆 {t("nav.badges_rewards")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.badges.map((b, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl flex items-center gap-4 border ${
                      b.unlocked
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-400 opacity-60"
                    }`}
                  >
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{b.name}</p>
                      <p className="text-xs mt-0.5">
                        {b.unlocked ? "✓ Unlocked & Verified" : "🔒 Locked (Post more donations)"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Donations Table & Nearby NGOs */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* My Household Donations */}
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    📜 {t("nav.my_donations")}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    + New Post
                  </button>
                </div>

                {dashboardData.my_donations.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p className="text-4xl mb-2">🍲</p>
                    <p className="text-sm font-medium">{t("kpi.no_donations")}</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Post Your First Donation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.my_donations.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <div>
                          <p className="font-bold text-gray-900">🍱 {item.food_name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} • {item.food_category}
                          </p>
                          <p className="text-xs text-amber-600 font-medium mt-1">⏰ {item.expiry_date}</p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === "Available"
                                ? "bg-amber-100 text-amber-800"
                                : item.status === "Accepted"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nearby NGOs Directory */}
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🤝 {t("nav.nearby_ngos")}
                </h3>

                {dashboardData.nearby_ngos.length === 0 ? (
                  <p className="text-gray-500 text-sm">No NGOs registered nearby yet.</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.nearby_ngos.map((ngo) => (
                      <div
                        key={ngo.id}
                        className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <div>
                          <p className="font-bold text-gray-900">🏢 {ngo.ngo_name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Contact: {ngo.contact_person} • 📞 {ngo.phone}</p>
                          <p className="text-xs text-gray-400 mt-0.5">📍 {ngo.address}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                            {ngo.distance_km ? `${ngo.distance_km} km` : "Nearby"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Post Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🍲 Post Home / Event Surplus Food
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Share fresh home-cooked meals, party surplus, or excess groceries with nearby food banks.
            </p>

            <form onSubmit={handlePostDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rice & Curry, 10 Sandwich boxes"
                  value={donationForm.food_name}
                  onChange={(e) => setDonationForm({ ...donationForm, food_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={donationForm.food_category}
                    onChange={(e) => setDonationForm({ ...donationForm, food_category: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Home Cooked Meal">Home Cooked Meal</option>
                    <option value="Party / Event Surplus">Party / Event Surplus</option>
                    <option value="Packaged Groceries">Packaged Groceries</option>
                    <option value="Fresh Fruits & Veggies">Fresh Fruits & Veggies</option>
                    <option value="Bakery / Sweets">Bakery / Sweets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity / Portions *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8 portions / 5 kg"
                    value={donationForm.quantity}
                    onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expiry / Best Before</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today before 10 PM"
                    value={donationForm.expiry_date}
                    onChange={(e) => setDonationForm({ ...donationForm, expiry_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={donationForm.phone}
                    onChange={(e) => setDonationForm({ ...donationForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={donationForm.pickup_address}
                  onChange={(e) => setDonationForm({ ...donationForm, pickup_address: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  {posting ? "Posting..." : "🚀 Post Food Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </IndividualDashboardLayout>
  );
}