import { useEffect, useState } from "react";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { getNGOHistory } from "../services/ngoService";

export default function NGOHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getNGOHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load NGO history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.food_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📜 Food Redistribution History
            </h1>
            <p className="text-gray-600 mt-1">
              Complete historical ledger of food claimed, picked up, and distributed by your NGO.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="🔍 Search food or donor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
            <button
              onClick={loadHistory}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 font-medium text-sm transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* History Metric Summary Header */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-4xl bg-blue-50 p-3 rounded-2xl">📦</div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Claimed Items</p>
              <h3 className="text-2xl font-bold text-gray-900">{history.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-4xl bg-green-50 p-3 rounded-2xl">🎉</div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Completed Pickups</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {history.filter((i) => i.status === "Completed").length}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-4xl bg-purple-50 p-3 rounded-2xl">🍽️</div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Food Recovery Impact</p>
              <h3 className="text-2xl font-bold text-gray-900">High Impact</h3>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <p className="text-5xl mb-4">📜</p>
            <h3 className="text-xl font-bold text-gray-800">No donation history recorded</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Completed food donations will be logged automatically in this permanent ledger.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-blue-600 text-white font-semibold text-sm">
                  <tr>
                    <th className="p-4">Food Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Donor Business</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Pickup Address</th>
                    <th className="p-4">Date Recorded</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-900">
                        🍱 {item.food_name}
                      </td>

                      <td className="p-4 text-gray-600">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {item.food_category}
                        </span>
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {item.business_name}
                      </td>

                      <td className="p-4 font-semibold text-blue-600">
                        {item.quantity}
                      </td>

                      <td className="p-4 text-gray-600 max-w-xs truncate">
                        {item.pickup_address}
                      </td>

                      <td className="p-4 text-gray-500 text-xs font-mono">
                        {item.created_at}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </NGODashboardLayout>
  );
}