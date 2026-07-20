import StatCard from "../components/dashboard/StatCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";

export default function NGODashboard() {

  const stats = {
    available: 12,
    accepted: 5,
    completed: 24,
    meals: 680,
  };

  const donations = [
    {
      id: 1,
      food: "Rice",
      donor: "ABC Restaurant",
      quantity: "20 kg",
      expiry: "Today",
    },
    {
      id: 2,
      food: "Bread",
      donor: "Hotel Sunshine",
      quantity: "50 pcs",
      expiry: "Tomorrow",
    },
    {
      id: 3,
      food: "Vegetables",
      donor: "Green Mart",
      quantity: "30 kg",
      expiry: "Today",
    },
  ];

  return (
    <NGODashboardLayout>

      <div className="max-w-7xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          NGO Dashboard
        </h2>

        {/* Stats */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Available Donations"
            value={stats.available}
            icon="🍱"
            color="text-green-600"
          />

          <StatCard
            title="Accepted Donations"
            value={stats.accepted}
            icon="🤝"
            color="text-blue-600"
          />

          <StatCard
            title="Completed Pickups"
            value={stats.completed}
            icon="✅"
            color="text-purple-600"
          />

          <StatCard
            title="Meals Distributed"
            value={stats.meals}
            icon="🍽️"
            color="text-orange-600"
          />

        </div>

        {/* Quick Actions */}

        <h2 className="text-2xl font-bold mt-12 mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <QuickActionCard
            title="Browse Donations"
            icon="🍱"
            path="/ngo/donations"
          />

          <QuickActionCard
            title="Accepted"
            icon="✅"
            path="/ngo/accepted"
          />

          <QuickActionCard
            title="History"
            icon="📜"
            path="/ngo/history"
          />

          <QuickActionCard
            title="Profile"
            icon="👤"
            path="/ngo/profile"
          />

        </div>

        {/* Bottom Section */}

        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          {/* AI Card */}

          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              🤖 AI Recommendation
            </h2>

            <div className="space-y-4">

              <div className="bg-green-100 p-4 rounded-xl">
                3 nearby donations are expiring today.
              </div>

              <div className="bg-blue-100 p-4 rounded-xl">
                Accept nearby requests to maximize food recovery.
              </div>

            </div>

          </div>

          {/* Recent Donations */}

          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              Recent Available Donations
            </h2>

            <ul className="space-y-4">

              {donations.map((item) => (

                <li
                  key={item.id}
                  className="flex justify-between border-b pb-3"
                >

                  <div>

                    <p className="font-semibold">
                      🍱 {item.food}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.donor}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold">
                      {item.quantity}
                    </p>

                    <span className="text-orange-500 text-sm">
                      {item.expiry}
                    </span>

                  </div>

                </li>

              ))}

            </ul>

          </div>

        </div>

      </div>

    </NGODashboardLayout>
  );
}