import { NavLink } from "react-router-dom";

export default function IndividualSidebar({ collapsed, setCollapsed }) {
  const menu = [
    { name: "Dashboard", path: "/dashboard/individual", icon: "🏠" },
    { name: "My Donations", path: "/individual/donations", icon: "🍱" },
    { name: "Nearby NGOs", path: "/individual/ngos", icon: "🤝" },
    { name: "Badges & Rewards", path: "/individual/badges", icon: "🏆" },
    { name: "My Profile", path: "/individual/profile", icon: "👤" },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");

  const accountName = profile?.full_name || user?.name || "Community Donor";
  const accountType = "Individual Donor";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-teal-800 text-white flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`border-b border-teal-700 ${
          collapsed ? "flex justify-center p-5" : "flex items-center justify-between p-6"
        }`}
      >
        {!collapsed && (
          <div>
            <h1 className="text-xl font-extrabold tracking-wide flex items-center gap-2">
              <span>🌱</span> FoodBridge AI
            </h1>
            <p className="text-[10px] text-teal-200 font-semibold tracking-wider uppercase mt-0.5">
              Community Donor
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-2xl hover:text-teal-200 transition"
        >
          ☰
        </button>
      </div>

      {/* Menu Links */}
      <nav className="mt-4 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-6 py-4 hover:bg-teal-700 transition ${
                isActive ? "bg-teal-700 font-bold border-r-4 border-amber-400" : ""
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      {!collapsed && (
        <div className="border-t border-teal-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white text-teal-800 flex items-center justify-center text-base font-extrabold shadow">
              {accountName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-bold text-sm truncate max-w-[130px]">{accountName}</p>
              <p className="text-xs text-teal-200">{accountType}</p>
            </div>
          </div>

          <div className="text-xs text-teal-100 space-y-1 mb-4">
            <p className="truncate">📧 {user?.email || "user@example.com"}</p>
            <p>📞 {profile?.phone || "Not set"}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-teal-800 font-bold py-2 rounded-xl text-xs hover:bg-teal-50 transition shadow"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </aside>
  );
}
