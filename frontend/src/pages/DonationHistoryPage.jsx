import { useEffect, useState } from "react";
import { getBusinessDonations } from "../services/donationService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import ImpactCertificateModal from "../components/dashboard/ImpactCertificateModal";

export default function DonationHistoryPage() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const businessId = storedUser?.business?.id;

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "Available", "Accepted", "Completed"
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadDonations();
  }, []);

  async function loadDonations() {
    try {
      setLoading(true);
      const data = await getBusinessDonations(businessId);
      setDonations(data || []);
    } catch (err) {
      console.error("Error loading business donations:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = donations.filter((donation) => {
    const matchesSearch =
      donation.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.food_category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "Accepted") return matchesSearch && (donation.status === "Accepted" || donation.status === "In Transit");
    return matchesSearch && donation.status === activeTab;
  });

  const totalMeals = donations.length * 15;
  const totalTaxCredits = donations.length * 450;
  const activeCount = donations.filter((d) => d.status === "Accepted" || d.status === "In Transit").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>🍱</span> Donation Management & Audit Ledger
            </h1>
            <p className="text-gray-600 mt-1">
              Track live pickup dispatches, recipient NGO handovers, and download Section 80G tax receipts.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              📄 Printable ESG & Tax Certificate
            </button>

            <button
              onClick={() => navigate("/donations/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              ➕ Create New Donation
            </button>
          </div>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-500">Total Donations Posted</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{donations.length}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-500">Meals Contributed</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{totalMeals}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-500">Section 80G Tax Credits</p>
            <h3 className="text-3xl font-extrabold text-blue-600 mt-1">₹{totalTaxCredits.toLocaleString()}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-500">Active Pickups En Route</p>
            <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{activeCount}</h3>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["all", "Available", "Accepted", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                }`}
              >
                {tab === "all"
                  ? "All History"
                  : tab === "Accepted"
                  ? "Active / En Route"
                  : tab}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍 Search food item or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Donations Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">🍱</p>
            <h3 className="text-xl font-bold text-gray-800">No donations found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              No food donation records match your search or filter selection.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Food Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Expiry Window</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions / Tax Audit</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filtered.map((donation) => (
                    <tr key={donation.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-gray-900">🍱 {donation.food_name}</td>
                      <td className="p-4 text-gray-600">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {donation.food_category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-blue-600">
                        {donation.quantity} {donation.unit || ""}
                      </td>
                      <td className="p-4 text-amber-600 text-xs font-medium">⏰ {donation.expiry_date}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            donation.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : donation.status === "Accepted" || donation.status === "In Transit"
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setIsCertificateOpen(true)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-lg transition border border-emerald-200"
                        >
                          📄 80G Receipt
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

      {/* Impact Certificate Modal */}
      {isCertificateOpen && (
        <ImpactCertificateModal isOpen={isCertificateOpen} onClose={() => setIsCertificateOpen(false)} />
      )}
    </DashboardLayout>
  );
}