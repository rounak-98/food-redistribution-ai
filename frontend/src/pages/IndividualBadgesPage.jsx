import { useEffect, useState } from "react";
import IndividualDashboardLayout from "../components/dashboard/IndividualDashboardLayout";
import { getIndividualDashboard } from "../services/individualService";

export default function IndividualBadgesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    badges: [],
    stats: { hero_points: 0, total_donations_posted: 0, meals_contributed: 0 }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getIndividualDashboard();
      setData(res);
    } catch (err) {
      console.error("Error loading badges:", err);
    } finally {
      setLoading(false);
    }
  };

  const leaderboard = [
    { rank: 1, name: "Anita Roy", meals: 140, points: 1400, badge: "👑 Eco Legend" },
    { rank: 2, name: "Suresh Kumar", meals: 95, points: 950, badge: "🏆 Community Hero" },
    { rank: 3, name: "Priya Sharma", meals: 70, points: 700, badge: "🌱 Zero-Waste Hero" },
    { rank: 4, name: data.user_profile?.name || "You", meals: data.stats.meals_contributed, points: data.stats.hero_points, badge: "🌱 Active Donor" },
  ];

  return (
    <IndividualDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏆 Badges & Community Karma Leaderboard</h1>
            <p className="text-gray-600 mt-1">
              Earn Hero XP Points, unlock sustainability badges, and see your rank in your city.
            </p>
          </div>

          <div className="bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl font-bold text-sm border border-amber-300 self-start md:self-auto">
            ⭐ Your Total Score: <span className="text-lg font-black text-amber-600">{data.stats.hero_points} XP</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* Badges Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {data.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 shadow-sm border transition flex items-center gap-5 ${
                    badge.unlocked ? "border-amber-300 bg-amber-50/50" : "border-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-5xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{badge.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {badge.unlocked ? "🎉 Unlocked & Verified" : "🔒 Complete 3+ food donations to unlock"}
                    </p>
                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                        badge.unlocked ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {badge.unlocked ? "Active Badge" : "Locked"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* City Leaderboard */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Community Leaderboard</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-center">Rank</th>
                    <th className="p-4">Donor Name</th>
                    <th className="p-4">Badge Status</th>
                    <th className="p-4">Meals Contributed</th>
                    <th className="p-4 text-right">Hero XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {leaderboard.map((user) => (
                    <tr
                      key={user.rank}
                      className={`hover:bg-slate-50 transition ${
                        user.name === data.user_profile?.name || user.name === "You"
                          ? "bg-amber-50/80 font-bold text-amber-900"
                          : ""
                      }`}
                    >
                      <td className="p-4 text-center font-extrabold text-lg">
                        {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : `#${user.rank}`}
                      </td>
                      <td className="p-4 font-bold text-gray-900">{user.name}</td>
                      <td className="p-4">
                        <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                          {user.badge}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-600">{user.meals} meals</td>
                      <td className="p-4 text-right font-extrabold text-amber-600">{user.points} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </IndividualDashboardLayout>
  );
}
