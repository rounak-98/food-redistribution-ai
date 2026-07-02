import StatCard from "../components/dashboard/StatCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import AIInsightCard from "../components/dashboard/AIInsightCard";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-green-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              FoodBridge AI Dashboard
            </h1>
            <p className="mt-2 text-green-100">
              Welcome back, ABC Restaurant 👋
            </p>
          </div>

          <div className="bg-green-600 px-4 py-2 rounded-full font-semibold">
            Business
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">

        {/* Stats */}
        <h2 className="text-2xl font-bold mb-6">
          Dashboard Overview
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Inventory Items"
            value="28"
            icon="📦"
            color="text-green-600"
          />

          <StatCard
            title="Active Donations"
            value="6"
            icon="🍱"
            color="text-orange-500"
          />

          <StatCard
            title="Meals Donated"
            value="1,245"
            icon="❤️"
            color="text-red-500"
          />

          <StatCard
            title="Partner NGOs"
            value="18"
            icon="🤝"
            color="text-blue-500"
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
          />

          <QuickActionCard
            title="Inventory"
            icon="📦"
          />

          <QuickActionCard
            title="Donation History"
            icon="📜"
          />

          <QuickActionCard
            title="Analytics"
            icon="📈"
          />

        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <AIInsightCard />

          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              Recent Donations
            </h2>

            <ul className="space-y-4">

              <li className="flex justify-between">
                <span>🍚 Rice</span>
                <span>25 kg</span>
              </li>

              <li className="flex justify-between">
                <span>🍞 Bread</span>
                <span>40 Loaves</span>
              </li>

              <li className="flex justify-between">
                <span>🥗 Vegetables</span>
                <span>15 kg</span>
              </li>

              <li className="flex justify-between">
                <span>🥛 Milk</span>
                <span>20 Litres</span>
              </li>

            </ul>

          </div>

        </div>

      </main>

    </div>
  );
}