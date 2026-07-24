import { useEffect, useState } from "react";
import VolunteerDashboardLayout from "../components/dashboard/VolunteerDashboardLayout";
import { getVolunteerDashboard } from "../services/volunteerService";

export default function VolunteerKarmaPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { deliveries_completed: 0, total_distance_km: 0, hours_volunteered: 0, karma_points: 0 },
    volunteer: {},
  });

  useEffect(() => {
    loadKarma();
  }, []);

  const loadKarma = async () => {
    try {
      setLoading(true);
      const res = await getVolunteerDashboard();
      setData(res);
    } catch (err) {
      console.error("Error loading karma stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const riderLeaderboard = [
    { rank: 1, name: "Karan Verma", vehicle: "⚡ EV Scooter", deliveries: 45, points: 6750 },
    { rank: 2, name: "Deepak Mehta", vehicle: "🛵 Motorcycle", deliveries: 32, points: 4800 },
    { rank: 3, name: data.volunteer?.full_name || "You", vehicle: data.volunteer?.vehicle_type || "Bike", deliveries: data.stats.deliveries_completed, points: data.stats.karma_points },
    { rank: 4, name: "Rohan Patil", vehicle: "🚗 Sedan", deliveries: 14, points: 2100 },
  ];

  return (
    <VolunteerDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⭐ Impact, Karma XP & Rider Ranking</h1>
            <p className="text-gray-600 mt-1">
              Track your logistics contributions, distance traveled, and rank on the city transport leaderboard.
            </p>
          </div>

          <div className="bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl font-bold text-sm border border-amber-300 self-start md:self-auto">
            ⭐ Total Rider Karma: <span className="text-lg font-black text-amber-600">{data.stats.karma_points} XP</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-500">Deliveries Handed Over</p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{data.stats.deliveries_completed}</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-500">Total Distance ($km$)</p>
                <h2 className="text-3xl font-extrabold text-blue-600 mt-1">{data.stats.total_distance_km} km</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-500">Volunteered Time</p>
                <h2 className="text-3xl font-extrabold text-purple-600 mt-1">{data.stats.hours_volunteered} hrs</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-500">Karma Score</p>
                <h2 className="text-3xl font-extrabold text-amber-500 mt-1">{data.stats.karma_points} XP</h2>
              </div>
            </div>

            {/* Leaderboard Table */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🛵 Logistics Rider Leaderboard</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-center">Rank</th>
                    <th className="p-4">Rider Name</th>
                    <th className="p-4">Vehicle Type</th>
                    <th className="p-4">Deliveries Completed</th>
                    <th className="p-4 text-right">Karma XP</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {riderLeaderboard.map((r) => (
                    <tr
                      key={r.rank}
                      className={`hover:bg-slate-50 transition ${
                        r.name === data.volunteer?.full_name || r.name === "You"
                          ? "bg-amber-50/80 font-bold text-amber-900"
                          : ""
                      }`}
                    >
                      <td className="p-4 text-center font-extrabold text-lg">
                        {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `#${r.rank}`}
                      </td>
                      <td className="p-4 font-bold text-gray-900">{r.name}</td>
                      <td className="p-4 text-gray-600 font-semibold">{r.vehicle}</td>
                      <td className="p-4 font-semibold text-blue-600">{r.deliveries} completed</td>
                      <td className="p-4 text-right font-extrabold text-amber-600">{r.points} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </VolunteerDashboardLayout>
  );
}

