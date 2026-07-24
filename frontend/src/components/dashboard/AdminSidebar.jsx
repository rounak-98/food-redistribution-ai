import { NavLink, useLocation } from "react-router-dom";

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "users";

  const menu = [
    { id: "users", name: "Manage Platform Users", path: "/dashboard/admin?tab=users", icon: "👥" },
    { id: "donations", name: "Master Donations Ledger", path: "/dashboard/admin?tab=donations", icon: "🍱" },
    { id: "deliveries", name: "Transport Dispatches", path: "/dashboard/admin?tab=deliveries", icon: "🚚" },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-indigo-950 text-white flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`border-b border-indigo-900 ${
          collapsed ? "flex justify-center p-5" : "flex items-center justify-between p-6"
        }`}
      >
        {!collapsed && (
          <div>
            <h1 className="text-xl font-extrabold tracking-wide flex items-center gap-2 text-indigo-400">
              <span>🛡️</span> FoodBridge AI
            </h1>
            <p className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase mt-0.5">
              System Admin Console
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-2xl text-indigo-300 hover:text-white transition"
        >
          ☰
        </button>
      </div>

      {/* Menu Links */}
      <nav className="mt-4 flex-1">
        {menu.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-6 py-4 hover:bg-indigo-900 transition ${
                isActive ? "bg-indigo-900 font-bold border-r-4 border-indigo-400 text-indigo-300" : ""
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Footer Card */}
      {!collapsed && (
        <div className="border-t border-indigo-900 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-base font-extrabold shadow">
              {(user?.name || "Admin").charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-bold text-sm truncate max-w-[130px]">{user?.name || "System Admin"}</p>
              <p className="text-[11px] text-indigo-300 font-semibold">Super Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2 rounded-xl text-xs transition shadow border border-indigo-800"
          >
            🚪 Logout Admin
          </button>
        </div>
      )}
    </aside>
  );
}
