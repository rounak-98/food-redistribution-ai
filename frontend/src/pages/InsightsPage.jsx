import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";

export default function InsightsPage() {

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const businessId = storedUser?.business?.id;

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const data = await getInventory(businessId);
      setInventory(data);
    } catch (err) {
      console.log(err);
    }
  }

  const fresh = inventory.filter(
    item => item.status === "Fresh"
  );

  const expiring = inventory.filter(
    item => item.status === "Expiring Soon"
  );

  const expired = inventory.filter(
    item => item.status === "Expired"
  );

  const totalItems = inventory.length;

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          🤖 AI Food Waste Insights
        </h1>

        <p className="text-gray-500 mb-8">
          Smart analysis of your inventory and donation activities.
        </p>

        {/* Inventory Health */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Total Items</p>
            <h2 className="text-4xl font-bold">
              {totalItems}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-green-600">
              Fresh Items
            </p>

            <h2 className="text-4xl font-bold text-green-600">
              {fresh.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-orange-500">
              Expiring Soon
            </p>

            <h2 className="text-4xl font-bold text-orange-500">
              {expiring.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-red-600">
              Expired
            </p>

            <h2 className="text-4xl font-bold text-red-600">
              {expired.length}
            </h2>
          </div>

        </div>
        
        <div className="bg-white rounded-2xl shadow p-8 mt-10">

            <h2 className="text-2xl font-bold mb-6">
                🤖 AI Recommendations
            </h2>

            {expired.length > 0 && (
                <p className="text-red-600 mb-3">
                    🔴 {expired.length} expired item(s) require immediate disposal.
                </p>
            )}

            {expiring.length > 0 && (
                <p className="text-orange-500 mb-3">
                    🟠 {expiring.length} item(s) should be donated within the next 5 days.
                </p>
            )}

            {expired.length === 0 && expiring.length === 0 && (
                <p className="text-green-600">
                    ✅ Excellent! No immediate action is required.
                </p>
            )}

            {expired.map((item) => (
                <p
                    key={item.id}
                    className="text-red-500 ml-6 mb-2"
                >
                    • Dispose <strong>{item.product_name}</strong>
                </p>
            ))}

            {expiring.map((item) => (
                <p
                    key={item.id}
                    className="text-orange-500 ml-6 mb-2"
                >
                    • Donate <strong>{item.product_name}</strong> soon
                </p>
            ))}

        </div>

        <div className="bg-indigo-100 rounded-2xl p-6 mb-8">

            <h2 className="text-2xl font-bold">
                🤖 Inventory Health Score
            </h2>

            <p className="text-gray-600 mt-2">
                Based on inventory freshness.
            </p>

            <h1 className="text-5xl font-bold text-indigo-700 mt-4">

                {
                    expired.length > 0
                    ? "72%"
                    : expiring.length > 0
                    ? "91%"
                    : "100%"
                }

            </h1>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="bg-green-100 rounded-2xl p-6">

                <h3 className="text-lg font-semibold">
                    🍱 Estimated Meals Saved
                </h3>

                <p className="text-4xl font-bold mt-4">
                    {totalItems * 10}
                </p>

            </div>

            <div className="bg-blue-100 rounded-2xl p-6">

                <h3 className="text-lg font-semibold">
                    ♻ Food Waste Prevented
                </h3>

                <p className="text-4xl font-bold mt-4">
                    {totalItems * 5} kg
                </p>

            </div>

            <div className="bg-yellow-100 rounded-2xl p-6">

                <h3 className="text-lg font-semibold">
                    🌍 Estimated CO₂ Saved
                </h3>

                <p className="text-4xl font-bold mt-4">
                    {totalItems * 2} kg
                </p>

            </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
        Top Categories
        </h2>

        <ul className="space-y-3">

        {
        [...new Set(inventory.map(item => item.category))]
        .map(category => (

        <li
        key={category}
        className="flex justify-between border-b pb-3"
        >

        <span>📦{category}</span>

        <span>

        {
        inventory.filter(
        item => item.category === category
        ).length
        }

        Items

        </span>

        </li>

        ))
        }

        </ul>

        </div>
      </div>


    </DashboardLayout>
  );
}