import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";
import { getDashboardStats } from "../services/donationService";

export default function ProfilePage() {

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const user = storedUser?.user;
  const business = storedUser?.business;

  const businessId = business?.id;

  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const inventoryData = await getInventory(businessId);
    setInventory(inventoryData);

    const dashboardStats = await getDashboardStats(businessId);
    setStats(dashboardStats);

  }

  const fresh = inventory.filter(i => i.status === "Fresh").length;
  const expiring = inventory.filter(i => i.status === "Expiring Soon").length;
  const expired = inventory.filter(i => i.status === "Expired").length;

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          👤 Business Profile
        </h1>

        <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold mb-6">
                Business Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

                <p><strong>Business Name:</strong> {business?.business_name}</p>

                <p><strong>Owner:</strong> {business?.owner_name}</p>

                <p><strong>Email:</strong> {user?.email}</p>

                <p><strong>Phone:</strong> {business?.phone}</p>

                <p><strong>City:</strong> {business?.city}</p>

                <p><strong>State:</strong> {business?.state}</p>


            </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 mb-8">

        <h2 className="text-2xl font-bold mb-6">
            ⚙️ Account Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

            <p>
                <strong>Business ID:</strong> {business?.id}
            </p>

            <p>
                <strong>Role:</strong> {user?.role}
            </p>

            <p>
                <strong>Status:</strong>

                <span className="ml-2 text-green-600 font-semibold">
                    🟢 Active
                </span>

            </p>

            <p>
                <strong>Member Since:</strong> July 2026
            </p>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">
            🚀 Quick Actions
        </h2>

        <div className="flex gap-4 flex-wrap">

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
                Edit Profile
            </button>

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
                Change Password
            </button>

            <button
                onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
            >
                Logout
            </button>

        </div>

      </div>

    </DashboardLayout>

  );
}