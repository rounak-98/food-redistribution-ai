import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import { getBusinessDonations } from "../services/donationService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";
import InventoryPieChart from "../components/dashboard/InventoryPieChart";
import CategoryBarChart from "../components/dashboard/CategoryBarChart";
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
      setSummary(data || {});
    } catch (err) {
      console.error("Error loading summary:", err);
      setSummary(null);
    }
  }

  async function loadInventory() {
    try {
      const data = await getInventory();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setInventory([]);
    }
  }

  async function loadDonations() {
    try {
      const data = await getBusinessDonations();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading donations:", err);
      setDonations([]);
    }
  }

  // Safe parsing of profile from localStorage
  let business = null;
  try {
    const rawProfile = localStorage.getItem("profile");
    if (rawProfile && rawProfile !== "undefined" && rawProfile !== "null") {
      business = JSON.parse(rawProfile);
    }
  } catch (e) {
    console.error("Error parsing business profile:", e);
  }

  // Determine accurate coordinates based on city or saved lat/lng
  const [cityLat, cityLng] = getCityCoordinates(business?.city || "bengaluru");
  const donorLat = business?.latitude && parseFloat(business.latitude) !== 0 ? parseFloat(business.latitude) : cityLat;
  const donorLng = business?.longitude && parseFloat(business.longitude) !== 0 ? parseFloat(business.longitude) : cityLng;

  const safeDonations = Array.isArray(donations) ? donations : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  // Local calculations fallback if backend summary is loading or cold-starting
  const localInventoryCount = safeInventory.length;
  const localDonationsCount = safeDonations.length;
  const localAvailableCount = safeDonations.filter((d) => d.status === "Available").length;
  const localCompletedCount = safeDonations.filter((d) => d.status === "Completed" || d.status === "Delivered").length;
  const localFoodSavedKg = (localCompletedCount * 25) + (localDonationsCount * 10) + (localInventoryCount * 5);

  // Build Dynamic Map Nodes from actual database donations & business coordinates
  const bizLocations = [
    {
      id: "donor-self",
      name: business?.business_name || "Food Donor Business HQ",
      type: "business",
      lat: donorLat,
      lng: donorLng,
      address: business?.address || `${business?.city || "Bengaluru"}, India`,
      phone: business?.phone || "+91 98765 43210",
      details: "🏢 Active Food Donor HQ",
    },
  ];

  // Dynamically add claimed NGOs from actual database donations
  safeDonations.forEach((item, idx) => {
    if (item.ngo_name) {
      bizLocations.push({
        id: `ngo-claimed-${item.id || idx}`,
        name: item.ngo_name,
        type: "ngo",
        lat: donorLat + (idx + 1) * 0.0054,
        lng: donorLng + (idx + 1) * 0.0074,
        address: "Partner NGO Destination",
        phone: item.ngo_phone || "+91 91234 56789",
        details: `🤝 Recipient for '${item.food_name}'`,
      });
    }
  });

  if (bizLocations.length === 1) {
    bizLocations.push({
      id: "ngo-partner-default",
      name: "Asha Food Shelter NGO",
      type: "ngo",
      lat: donorLat + 0.0084,
      lng: donorLng + 0.0104,
      address: "45 Brigade Road, NGO Center",
      phone: "+91 91234 56789",
      details: "🤝 Verified Partner Shelter",
    });
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
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
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Operational Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPIStatCard
              title="Total Donations"
              value={summary?.total_donations ?? localDonationsCount}
              icon={<FaHandsHelping />}
              color="green"
              change="+12%"
              subtitle="All donations"
            />

            <KPIStatCard
              title="Available Donations"
              value={summary?.available_donations ?? localAvailableCount}
              icon={<FaBoxOpen />}
              color="orange"
              change="+5%"
              subtitle="Ready for pickup"
            />

            <KPIStatCard
              title="Inventory Items"
              value={summary?.inventory_items ?? localInventoryCount}
              icon={<FaBoxOpen />}
              color="blue"
              change="+8%"
              subtitle="Currently stored"
            />

            <KPIStatCard
              title="Completed Pickups"
              value={summary?.completed_pickups ?? localCompletedCount}
              icon={<FaTruck />}
              color="green"
              change="+18%"
              subtitle="Successfully delivered"
            />

            <KPIStatCard
              title="Food Saved (kg)"
              value={summary?.food_saved_kg ?? localFoodSavedKg}
              icon={<FaLeaf />}
              color="orange"
              change="+15%"
              subtitle="Estimated total"
            />

            <KPIStatCard
              title="CO₂ Avoided (kg)"
              value={summary?.co2_saved_kg ?? Math.round(localFoodSavedKg * 2.5)}
              icon={<FaLeaf />}
              color="green"
              change="+20%"
              subtitle="Carbon Reduction"
            />

            <KPIStatCard
              title="Sec 80G Tax Credit (Est.)"
              value={`₹${summary?.tax_deduction_estimate_inr ?? Math.round(localFoodSavedKg * 140 * 0.25)}`}
              icon={<FaFileInvoiceDollar />}
              color="blue"
              change="+25%"
              subtitle="Tax Exemption"
            />

            <KPIStatCard
              title="Waste Prevented (kg)"
              value={summary?.waste_prevented_kg ?? Math.round(localFoodSavedKg * 0.85)}
              icon={<FaTrashAlt />}
              color="red"
              change="+5%"
              subtitle="AI Estimate"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              title="Add Donation"
              icon="➕"
              path="/donations/add"
              description="Donate surplus food directly to verified partner NGOs"
              buttonText="Create Donation"
            />
            <QuickActionCard
              title="Inventory Portal"
              icon="📦"
              path="/inventory"
              description="Add, view, and organize stored food inventory items"
              buttonText="View Inventory"
            />
            <QuickActionCard
              title="Donation History"
              icon="📜"
              path="/donations/history"
              description="Track past food donations and claimed pickups"
              buttonText="View History"
            />
            <QuickActionCard
              title="Analytics & Insights"
              icon="📈"
              path="/analytics"
              description="View detailed impact metrics and reports"
              buttonText="View Analytics"
            />
          </div>
        </div>

        {/* Dispatch Tracker & Forecast Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <DispatchTrackerCard donations={donations} />
          <SurplusForecastCard />
        </div>

        {/* AI Insight & Recent Donations */}
        <div className="grid lg:grid-cols-2 gap-8">
          <AIInsightCard inventory={inventory} />

          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Recent Donations
            </h2>

            <ul className="space-y-4">
              {safeDonations.length === 0 ? (
                <p className="text-gray-500 py-6 text-center">No donations posted yet.</p>
              ) : (
                safeDonations.slice(0, 5).map((item) => (
                  <li
                    key={item.id || item.donation_id || Math.random()}
                    className="flex justify-between border-b pb-3 items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        🍱 {item.food_name || "Food Donation"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cat: {item.food_category || item.category || "Surplus Meals"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {item.quantity}
                      </p>
                      <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {item.status || "Available"}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Live GIS Logistics Map Section */}
        <div>
          <LiveMapWidget
            title="Live Pickup & Transport GIS Logistics Map"
            locations={bizLocations}
            center={[donorLat, donorLng]}
            height="380px"
          />
        </div>

        {/* Inventory Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <InventoryPieChart inventory={inventory} />
          <CategoryBarChart inventory={inventory} />
        </div>
      </div>

      {/* ESG Sustainability Certificate Modal */}
      <ImpactCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        summary={summary || {
          total_donations: localDonationsCount,
          available_donations: localAvailableCount,
          inventory_items: localInventoryCount,
          completed_pickups: localCompletedCount,
          food_saved_kg: localFoodSavedKg,
          waste_prevented_kg: Math.round(localFoodSavedKg * 0.85),
          co2_saved_kg: Math.round(localFoodSavedKg * 2.5),
          financial_savings_inr: localFoodSavedKg * 140,
          tax_deduction_estimate_inr: Math.round(localFoodSavedKg * 140 * 0.25),
        }}
        business={business}
      />
    </DashboardLayout>
  );
}