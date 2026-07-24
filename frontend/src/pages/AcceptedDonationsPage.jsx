import { useEffect, useState } from "react";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { getAcceptedDonations, completeDonation } from "../services/ngoService";

export default function AcceptedDonationsPage() {
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadAcceptedDonations();
  }, []);

  const loadAcceptedDonations = async () => {
    try {
      setLoading(true);
      const data = await getAcceptedDonations();
      setAcceptedDonations(data);
    } catch (error) {
      console.error("Failed to load accepted donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      setActionLoading(id);
      await completeDonation(id);
      setAcceptedDonations((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to mark donation as completed:", error);
      alert("Error marking donation as completed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ✅ Accepted Donations
            </h1>
            <p className="text-gray-600 mt-1">
              Active food donations accepted by your NGO waiting for pickup or distribution.
            </p>
          </div>

          <button
            onClick={loadAcceptedDonations}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 font-medium transition self-start md:self-auto"
          >
            🔄 Refresh List
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : acceptedDonations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="text-xl font-bold text-gray-800">No active accepted donations</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              You haven't accepted any food donations currently in progress. Browse available donations to claim food surplus!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-blue-600 text-white font-semibold text-sm">
                  <tr>
                    <th className="p-4">Food Item</th>
                    <th className="p-4">Donor Business</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Pickup Address & Time</th>
                    <th className="p-4">Donor Phone</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {acceptedDonations.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-4 font-bold text-gray-900">
                        🍱 {item.food_name}
                        <span className="block text-xs font-normal text-gray-500 mt-0.5">
                          Cat: {item.food_category}
                        </span>
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {item.business?.business_name || "Food Donor"}
                      </td>

                      <td className="p-4 font-semibold text-blue-600">
                        {item.quantity}
                      </td>

                      <td className="p-4 text-gray-600 max-w-xs">
                        <p className="font-medium text-gray-800">{item.pickup_address}</p>
                        <p className="text-xs text-orange-600 font-semibold mt-0.5">
                          🕒 Pickup: {item.pickup_time}
                        </p>
                      </td>

                      <td className="p-4 text-gray-700">
                        📞 {item.phone || item.business?.phone || "N/A"}
                      </td>

                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleComplete(item.id)}
                          disabled={actionLoading === item.id}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow transition flex items-center gap-1.5 mx-auto"
                        >
                          {actionLoading === item.id ? "Updating..." : "🎉 Mark Picked Up"}
                        </button>
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