import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NGOSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { t } = useTranslation();

  const menu = [
    { name: t("nav.dashboard"), path: "/dashboard/ngo", icon: "🏠" },
    { name: t("kpi.available_donations"), path: "/ngo/donations", icon: "🍱" },
    { name: "Accepted Donations", path: "/ngo/accepted", icon: "✅" },
    { name: t("nav.history"), path: "/ngo/history", icon: "📜" },
    { name: t("nav.profile"), path: "/ngo/profile", icon: "👤" },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");

  const accountName = profile?.ngo_name || user?.name || "NGO Partner";
  const accountType = t("roles.ngo");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  const closeMobileMenu = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-blue-700 text-white flex flex-col transition-all duration-300 z-50 ${
          collapsed ? "md:w-20" : "md:w-64"
        } ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div
          className={`border-b border-blue-600 ${
            collapsed ? "flex justify-center p-5" : "flex items-center justify-between p-6"
          }`}
        >
          {(!collapsed || mobileOpen) && (
            <h1 className="text-2xl font-bold">
              FoodBridge AI
            </h1>
          )}

          <button
            onClick={() => {
              if (window.innerWidth < 768 && setMobileOpen) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="text-2xl hover:text-gray-200 transition p-1"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center ${
                  collapsed && !mobileOpen ? "justify-center" : "gap-3"
                } px-6 py-4 hover:bg-blue-600 transition ${
                  isActive ? "bg-blue-600 font-bold" : ""
                }`
              }
            >
              <span>{item.icon}</span>
              {(!collapsed || mobileOpen) && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="border-t border-blue-600 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white text-blue-700 flex items-center justify-center text-base font-bold shadow">
                {accountName.charAt(0).toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{accountName}</p>
                <p className="text-xs text-blue-200 truncate">{accountType}</p>
              </div>
            </div>

            <div className="text-xs text-blue-100 space-y-1 truncate">
              <p className="truncate">📧 {user?.email}</p>
              <p className="truncate">📞 {profile?.phone || "Not Available"}</p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-white text-blue-700 font-semibold py-2 text-sm rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              {t("nav.logout")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}