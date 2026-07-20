import { NavLink } from "react-router-dom";

export default function NGOSidebar({ collapsed, setCollapsed }) {
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

  const user = JSON.parse(localStorage.getItem("user"));
  const profile = JSON.parse(localStorage.getItem("profile"));

  const accountName =
    user?.role === "ngo"
      ? profile?.ngo_name
      : profile?.business_name;

  const accountType =
    user?.role === "ngo"
      ? "NGO Account"
      : "Business Account";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-blue-700 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
    >

      <div
        className={`border-b border-blue-600 ${collapsed
          ? "flex justify-center p-5"
          : "flex items-center justify-between p-6"
          }`}
      >
        {!collapsed && (
          <h1 className="text-2xl font-bold">
            FoodBridge AI
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-2xl hover:text-gray-200 transition"
        >
          ☰
        </button>
      </div>

      <nav className="mt-4 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? "justify-center" : "gap-3"
              } px-6 py-4 hover:bg-blue-600 transition ${isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <span>{item.icon}</span>

            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}

      </nav>
      {!collapsed && (
        <div className="border-t border-blue-600 p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center text-lg font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-sm">
                {accountName || user?.name}
              </p>

              <p className="text-xs text-blue-200">
                {accountType}
              </p>
            </div>

          </div>

          <div className="text-sm text-blue-100 space-y-1">
            <p>📧 {user?.email}</p>
            <p>📞 {profile?.phone || "Not Available"}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>

        </div>
      )}
    </aside>
  );
}