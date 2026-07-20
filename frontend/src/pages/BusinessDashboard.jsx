import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import { getDashboardStats, getBusinessDonations } from "../services/donationService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";
import InventoryPieChart from "../components/dashboard/InventoryPieChart";
import CategoryBarChart from "../components/dashboard/CategoryBarChart";
import DonationTrendChart from "../components/dashboard/DonationTrendChart";
import KPIStatCard from "../components/dashboard/KPIStatCard";
import {
  FaBoxOpen,
  FaLeaf,
  FaTrashAlt,
  FaHandsHelping,
  FaTruck,
} from "react-icons/fa";

export default function BusinessDashboard() {

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const businessId = storedUser?.business?.id;
  const [inventory, setInventory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState(null);
  
  useEffect(() => {
    loadInventory();
    loadDonations();
    loadDashboardSummary();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats(businessId);
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  }

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
      const data = await getInventory(businessId);
      setInventory(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadDonations() {
    try {
      const data = await getBusinessDonations(businessId);
      setDonations(data);
    } catch (err) {
      console.log(err);
    }
  }

  const data = JSON.parse(localStorage.getItem("user"));

  const user = data?.user;
  const business = data?.business;
  console.log("Inventory:", inventory);
  console.log("Donations:", donations);
  return (
    <DashboardLayout>


      <div className="max-w-7xl mx-auto ">

        {/* Stats */}
        <h2 className="text-2xl font-bold mb-6">
          Dashboard Overview
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
            subtitle="Estimated"
          />

          <KPIStatCard
            title="Waste Prevented"
            value={summary?.waste_prevented_kg ?? 0}
            icon={<FaTrashAlt />}
            color="red"
            change="+5%"
            subtitle="AI Estimate"
          />

          <KPIStatCard
            title="Partner NGOs"
            value={summary?.partner_ngos ?? 0}
            icon={"🤝"}
            color="blue"
            change="+2"
            subtitle="Active partners"
          />

          <KPIStatCard
            title="AI Health Score"
            value={summary?.ai_health_score ?? 0}
            icon={"🤖"}
            color="green"
            change="+4%"
            subtitle="Inventory quality"
          />

        </div>
        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mt-12 mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <QuickActionCard
            title="Add Donation"
            icon="➕"
            path="/donations/add"
          />

          <QuickActionCard
            title="Inventory"
            icon="📦"
            path="/inventory"
          />

          <QuickActionCard
            title="Donation History"
            icon="📜"
            path="/donations/history"
          />

          <QuickActionCard
            title="Analytics"
            icon="📈"
            path="/analytics"
          />

        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <AIInsightCard inventory={inventory} />

          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              Recent Donations
            </h2>

            <ul className="space-y-4">

              {donations.length === 0 ? (

                <p className="text-gray-500">
                  No donations yet.
                </p>

              ) : (

                donations.slice(0,5).map((item) => (

                  <li
                    key={item.id}
                    className="flex justify-between border-b pb-3"
                  >

                    <div>

                      <p className="font-semibold">
                        🍱 {item.food_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.food_category}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold">
                        {item.quantity}
                      </p>

                      <span className="text-green-600 text-sm">
                        {item.status}
                      </span>

                    </div>

                  </li>

                ))

              )}

            </ul>

          </div>

        </div>


        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <InventoryPieChart inventory={inventory} />

          <CategoryBarChart inventory={inventory} />

        </div>

        <div className="mt-10">

          <DonationTrendChart donations={donations} />

        </div>
        
      </div>

    </DashboardLayout>
  );
}