import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { getAvailableDonations, acceptDonation } from "../services/ngoService";

export default function AvailableDonationsPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getAvailableDonations();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching available donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    try {
      setClaimingId(id);
      await acceptDonation(id);
      alert("Donation accepted successfully! You can now track it under Accepted Donations.");
      navigate("/ngo/accepted");
    } catch (error) {
      console.error("Error claiming donation:", error);
      alert(error.response?.data?.detail || "Failed to accept donation.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🍱 Available Food Donations
            </h1>
            <p className="text-gray-600 mt-1">
              Browse food donations available for pickup near your operational location.
            </p>
          </div>

          <button
            onClick={fetchDonations}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 font-medium transition self-start md:self-auto"
          >
            🔄 Refresh Feed
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <p className="text-5xl mb-4">🍃</p>
            <h3 className="text-xl font-bold text-gray-800">No food donations available right now</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Check back soon! Donors post surplus food throughout the day.
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
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Distance</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {donations.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-4 font-bold text-gray-900">
                        🍱 {item.food_name}
                      </td>

                      <td className="p-4 text-gray-600">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {item.food_category}
                        </span>
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {item.business_name}
                      </td>

                      <td className="p-4 font-semibold text-blue-600">
                        {item.quantity}
                      </td>

                      <td className="p-4 text-orange-600 font-medium">
                        ⏰ {item.expiry_date}
                      </td>

                      <td className="p-4 font-semibold text-gray-700">
                        {item.distance_km !== null ? (
                          <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                            📍 {item.distance_km} km
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/ngo/donation-details/${item.id}`)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleClaim(item.id)}
                            disabled={claimingId === item.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                          >
                            {claimingId === item.id ? "Claiming..." : "🤝 Claim Food"}
                          </button>
                        </div>
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