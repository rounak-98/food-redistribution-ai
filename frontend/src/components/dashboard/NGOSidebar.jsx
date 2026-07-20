import { NavLink } from "react-router-dom";

export default function NGOSidebar() {
  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard/ngo",
      icon: "🏠",
    },
    {
      name: "Available Donations",
      path: "/ngo/donations",
      icon: "🍱",
    },
    {
      name: "Accepted Donations",
      path: "/ngo/accepted",
      icon: "✅",
    },
    {
      name: "History",
      path: "/ngo/history",
      icon: "📜",
    },
    {
      name: "Profile",
      path: "/ngo/profile",
      icon: "👤",
    },
  ];

  return (
    <aside className="w-64 bg-blue-700 text-white min-h-screen">

      <div className="text-2xl font-bold p-6 border-b border-blue-600">
        FoodBridge AI
      </div>

      <nav className="mt-4">

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 hover:bg-blue-600 transition ${
                isActive ? "bg-blue-600" : ""
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