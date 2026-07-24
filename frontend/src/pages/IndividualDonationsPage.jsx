import { useEffect, useState } from "react";
import IndividualDashboardLayout from "../components/dashboard/IndividualDashboardLayout";
import { getIndividualDashboard, postIndividualDonation } from "../services/individualService";

export default function IndividualDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posting, setPosting] = useState(false);

  const [donationForm, setDonationForm] = useState({
    food_name: "",
    food_category: "Home Cooked Meal",
    quantity: "5 portions",
    expiry_date: "Today before 9 PM",
    pickup_address: "",
    pickup_time: "Today (Flexible)",
    phone: "",
    special_instructions: "Fresh excess home food prepared today. Cleanly packed.",
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await getIndividualDashboard();
      setDonations(data.my_donations || []);
      if (data.user_profile) {
        setDonationForm((prev) => ({
          ...prev,
          pickup_address: data.user_profile.address || "",
          phone: data.user_profile.phone || "",
        }));
      }
    } catch (err) {
      console.error("Error loading individual donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDonation = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await postIndividualDonation(donationForm);
      alert(res.message);
      setIsModalOpen(false);
      loadDonations();
    } catch (err) {
      console.error("Failed to post donation:", err);
      alert("Failed to post donation.");
    } finally {
      setPosting(false);
    }
  };

  const filtered = donations.filter(
    (item) =>
      item.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.food_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IndividualDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🍱 My Home Food Donations</h1>
            <p className="text-gray-600 mt-1">
              History & live status tracking for all household food surplus posted by you.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition self-start md:self-auto text-sm"
          >
            ➕ Post New Home Donation
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <input
            type="text"
            placeholder="🔍 Search food item or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">🍲</p>
            <h3 className="text-xl font-bold text-gray-800">No home food donations found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Post your excess home meals, party surplus, or groceries to share with local food banks!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
            >
              Post Food Donation
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Food Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Portions / Quantity</th>
                    <th className="p-4">Expiry Window</th>
                    <th className="p-4">Date Posted</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/50 transition">
                      <td className="p-4 font-bold text-gray-900">🍱 {item.food_name}</td>
                      <td className="p-4 text-gray-600">
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {item.food_category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-700">{item.quantity}</td>
                      <td className="p-4 text-amber-600 font-medium">⏰ {item.expiry_date}</td>
                      <td className="p-4 text-gray-500 text-xs font-mono">{item.created_at}</td>
                      <td className="p-4 text-center">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">🍲 Post Home Surplus Food</h2>
            <p className="text-xs text-gray-500 mb-6">
              Share fresh home meals or event surplus food with local food banks.
            </p>

            <form onSubmit={handlePostDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Food Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8 Portion Paneer Butter Masala & Rice"
                  value={donationForm.food_name}
                  onChange={(e) => setDonationForm({ ...donationForm, food_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={donationForm.food_category}
                    onChange={(e) => setDonationForm({ ...donationForm, food_category: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Home Cooked Meal">Home Cooked Meal</option>
                    <option value="Party / Event Surplus">Party / Event Surplus</option>
                    <option value="Packaged Groceries">Packaged Groceries</option>
                    <option value="Bakery / Sweets">Bakery / Sweets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity / Portions *</label>
                  <input
                    type="text"
                    required
                    value={donationForm.quantity}
                    onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date / Window</label>
                  <input
                    type="text"
                    required
                    value={donationForm.expiry_date}
                    onChange={(e) => setDonationForm({ ...donationForm, expiry_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={donationForm.phone}
                    onChange={(e) => setDonationForm({ ...donationForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
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
