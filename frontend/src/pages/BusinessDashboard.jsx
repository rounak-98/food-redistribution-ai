import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import { getBusinessDonations } from "../services/donationService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";
import InventoryPieChart from "../components/dashboard/InventoryPieChart";
import CategoryBarChart from "../components/dashboard/CategoryBarChart";
import DonationTrendChart from "../components/dashboard/DonationTrendChart";
import KPIStatCard from "../components/dashboard/KPIStatCard";
import ImpactCertificateModal from "../components/dashboard/ImpactCertificateModal";
import DispatchTrackerCard from "../components/dashboard/DispatchTrackerCard";
import SurplusForecastCard from "../components/dashboard/SurplusForecastCard";
import {
  FaBoxOpen,
  FaLeaf,
  FaTrashAlt,
  FaHandsHelping,
  FaTruck,
  FaFileInvoiceDollar,
} from "react-icons/fa";

export default function BusinessDashboard() {
  const [inventory, setInventory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  useEffect(() => {
    loadInventory();
    loadDonations();
    loadDashboardSummary();
  }, []);

  async function loadDashboardSummary() {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadInventory() {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadDonations() {
    try {
      const data = await getBusinessDonations();
      setDonations(data);
    } catch (err) {
      console.log(err);
    }
  }

  const business = JSON.parse(localStorage.getItem("profile"));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Certificate Banner & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-6 rounded-3xl text-white shadow-xl">
          <div>
            <div className="inline-block bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider border border-amber-400/30">
              Verified Food Donor Portal
            </div>
            <h1 className="text-3xl font-bold">
              Welcome back, {business?.business_name || "Partner Business"}
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Food surplus management, live dispatch tracking & ESG sustainability dashboard
            </p>
          </div>

          <button
            onClick={() => setIsCertificateOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 self-start md:self-auto border border-emerald-400"
          >
            📜 Download ESG & Tax Certificate
          </button>
        </div>

        {/* Dashboard Overview KPI Stats */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Operational Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPIStatCard
            title="Total Donations"
            value={summary?.total_donations ?? 0}
            icon={<FaHandsHelping />}
            color="green"
            change="+12%"
            subtitle="All donations"
          />

          <KPIStatCard
            title="Available Donations"
            value={summary?.available_donations ?? 0}
            icon={<FaBoxOpen />}
            color="orange"
            change="+5%"
            subtitle="Ready for pickup"
          />

          <KPIStatCard
            title="Inventory Items"
            value={summary?.inventory_items ?? 0}
            icon={<FaBoxOpen />}
            color="blue"
            change="+8%"
            subtitle="Currently stored"
          />

          <KPIStatCard
            title="Completed Pickups"
            value={summary?.completed_pickups ?? 0}
            icon={<FaTruck />}
            color="green"
            change="+18%"
            subtitle="Successfully delivered"
          />

          <KPIStatCard
            title="Food Saved (kg)"
            value={summary?.food_saved_kg ?? 0}
            icon={<FaLeaf />}
            color="orange"
            change="+15%"
            subtitle="Estimated total"
          />

          <KPIStatCard
            title="CO₂ Avoided (kg)"
            value={summary?.co2_saved_kg ?? 0}
            icon={<FaLeaf />}
            color="green"
            change="+20%"
            subtitle="Carbon Reduction"
          />

          <KPIStatCard
            title="Sec 80G Tax Credit (Est.)"
            value={`₹${summary?.tax_deduction_estimate_inr ?? 0}`}
            icon={<FaFileInvoiceDollar />}
            color="blue"
            change="+25%"
            subtitle="Tax Exemption"
          />

          <KPIStatCard
            title="Waste Prevented (kg)"
            value={summary?.waste_prevented_kg ?? 0}
            icon={<FaTrashAlt />}
            color="red"
            change="+5%"
            subtitle="AI Estimate"
          />
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Add Donation"
            icon="➕"
            path="/donations/add"
          />
          <QuickActionCard
            title="Inventory Portal"
            icon="📦"
            path="/inventory"
          />
          <QuickActionCard
            title="Donation History"
            icon="📜"
            path="/donations/history"
          />
          <QuickActionCard
            title="Analytics & Insights"
            icon="📈"
            path="/analytics"
          />
        </div>

        {/* Dispatch Tracker & Forecast Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <DispatchTrackerCard donations={donations} />
          <SurplusForecastCard />
        </div>

        {/* AI Insight & Recent Donations */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <AIInsightCard inventory={inventory} />

          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Recent Donations
            </h2>

            <ul className="space-y-4">
              {donations.length === 0 ? (
                <p className="text-gray-500">No donations posted yet.</p>
              ) : (
                donations.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between border-b pb-3 items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        🍱 {item.food_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cat: {item.food_category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {item.quantity}
                      </p>
                      <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {item.status}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Inventory Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <InventoryPieChart inventory={inventory} />
          <CategoryBarChart inventory={inventory} />
        </div>

        <div className="mt-10">
          <DonationTrendChart donations={donations} />
        </div>
      </div>

      {/* ESG Sustainability Certificate Modal */}
      <ImpactCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        summary={summary}
        business={business}
      />
    </DashboardLayout>
  );
}