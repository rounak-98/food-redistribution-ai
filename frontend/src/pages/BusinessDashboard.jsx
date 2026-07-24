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
import LiveMapWidget, { getCityCoordinates } from "../components/dashboard/LiveMapWidget";
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

  // Safe parsing of profile from localStorage
  let business = null;
  try {
    const rawProfile = localStorage.getItem("profile");
    if (rawProfile && rawProfile !== "undefined") {
      business = JSON.parse(rawProfile);
    }
  } catch (e) {
    console.error("Error parsing business profile:", e);
  }

  // Determine accurate coordinates based on city or saved lat/lng
  const [cityLat, cityLng] = getCityCoordinates(business?.city || "bengaluru");
  const donorLat = business?.latitude && parseFloat(business.latitude) !== 0 ? parseFloat(business.latitude) : cityLat;
  const donorLng = business?.longitude && parseFloat(business.longitude) !== 0 ? parseFloat(business.longitude) : cityLng;

  // Build Map Nodes for Business Dashboard
  const bizLocations = [
    {
      id: "donor-self",
      name: business?.business_name || "Royal Palace Hotel & Bakery",
      type: "business",
      lat: donorLat,
      lng: donorLng,
      address: business?.address || `${business?.city || "Bengaluru"}, India`,
      phone: business?.phone || "+91 98765 43210",
      details: "🏢 Active Food Donor HQ",
    },
    {
      id: "ngo-partner-1",
      name: "Asha Food Shelter NGO",
      type: "ngo",
      lat: donorLat + 0.0084,
      lng: donorLng + 0.0104,
      address: "45 Brigade Road, NGO Center",
      phone: "+91 91234 56789",
      details: "🤝 Verified Recipient Shelter",
    },
    {
      id: "rider-dispatch-1",
      name: "En-Route Transport Rider",
      type: "rider",
      lat: donorLat + 0.0034,
      lng: donorLng + 0.0054,
      address: "1.2 km away from pickup",
      phone: "+91 99887 76655",
      details: "🛵 Active Dispatch Rider",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Certificate Banner & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 shadow-xl border border-indigo-800">
          <div>
            <div className="inline-block bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider border border-amber-400/30">
              Verified Food Donor Portal
            </div>
            <h1 className="text-3xl font-bold">
              Welcome back, {business?.business_name || "Partner Business"}
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Food surplus management, live GIS dispatch tracking & ESG sustainability dashboard
            </p>
          </div>

          <button
            onClick={() => setIsCertificateOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 self-start md:self-auto border border-emerald-400"
          >
            📜 Download ESG & Tax Certificate
          </button>
        </div>

        {/* Live GIS Map Widget */}
        <LiveMapWidget
          title="Live Pickup & Transport GIS Logistics Map"
          locations={bizLocations}
          center={[donorLat, donorLng]}
          height="380px"
        />

        {/* Live Dispatch Tracker */}
        <DispatchTrackerCard donations={donations} />

        {/* Dashboard Overview KPI Stats */}
        <div>
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
        </div>

        {/* AI Surplus Forecast */}
        <SurplusForecastCard />

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Post Surplus Food"
              description="Donate surplus food directly to verified partner NGOs"
              link="/donations/new"
              buttonText="Create Donation"
            />
            <QuickActionCard
              title="Manage Inventory"
              description="Add, view, and organize stored food inventory items"
              link="/inventory"
              buttonText="View Inventory"
            />
            <QuickActionCard
              title="Donation History"
              description="Track past food donations and claimed pickups"
              link="/history"
              buttonText="View History"
            />
          </div>
        </div>

        {/* AI Health & Insights */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">AI Health & Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AIInsightCard
              title="AI System Health"
              value={`${summary?.ai_health_score ?? 98}%`}
              description="Overall operational efficiency and food redistribution match quality."
            />
            <AIInsightCard
              title="Redistribution Recommendation"
              value="Optimal"
              description="High pickup availability in your zone. Consider listing surplus items before 6 PM."
            />
          </div>
        </div>

        {/* Visual Charts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Inventory & Analytics Visualizer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InventoryPieChart inventory={inventory} />
            <CategoryBarChart inventory={inventory} />
          </div>
          <div className="mt-6">
            <DonationTrendChart donations={donations} />
          </div>
        </div>

        {/* ESG Certificate Modal */}
        <ImpactCertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          businessName={business?.business_name || "Partner Business"}
          foodSavedKg={summary?.food_saved_kg ?? 0}
          co2SavedKg={summary?.co2_saved_kg ?? 0}
          financialSavingsINR={summary?.financial_savings_inr ?? 0}
          taxDeductionINR={summary?.tax_deduction_estimate_inr ?? 0}
        />
      </div>
    </DashboardLayout>
  );
}