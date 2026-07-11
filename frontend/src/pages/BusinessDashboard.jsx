import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import { getDashboardStats, getBusinessDonations } from "../services/donationService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";

export default function BusinessDashboard() {

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const businessId = storedUser?.business?.id;
  const [inventory, setInventory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    total_donations: 0,
    available_donations: 0,
    completed_pickups: 0,
  });

  useEffect(() => {
    loadStats();
    loadInventory();
    loadDonations();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats(businessId);
      setStats(data);
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

  return (
    <DashboardLayout>


      <div className="max-w-7xl mx-auto ">

        {/* Stats */}
        <h2 className="text-2xl font-bold mb-6">
          Dashboard Overview
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Total Donations"
            value={stats.total_donations}
            icon="🍱"
            color="text-green-600"
          />

          <StatCard
            title="Available Donations"
            value={stats.available_donations}
            icon="📦"
            color="text-orange-500"
          />

          <StatCard
            title="Completed Pickups"
            value={stats.completed_pickups}
            icon="✅"
            color="text-blue-500"
/>

          <StatCard
            title="Partner NGOs"
            value="18"
            icon="🤝"
            color="text-purple-500"
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

      </div>

    </DashboardLayout>
  );
}