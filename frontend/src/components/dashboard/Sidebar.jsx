import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/dashboard/business", icon: "🏠" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
    { name: "Donations", path: "/donations/", icon: "🍱" },
    { name: "Insights", path: "/insights", icon: "📊" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Alerts", path: "/alerts", icon: "🔔" },
  ];

  return (
    <aside className="w-64 bg-green-700 text-white min-h-screen">

      <div className="text-2xl font-bold p-6 border-b border-green-600">
        FoodBridge AI
      </div>

      <nav className="mt-4">

        {menu.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 hover:bg-green-600 transition ${
                isActive ? "bg-green-600" : ""
              }`
            }
          >
            <span>{item.icon}</span>

            <span>{item.name}</span>

          </NavLink>

        ))}

      </nav>

    </aside>
  );
}