import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { t } = useTranslation();
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
        className={`fixed left-0 top-0 h-screen bg-indigo-950 text-white flex flex-col transition-all duration-300 z-50 ${
          collapsed ? "md:w-20" : "md:w-64"
        } ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div
          className={`border-b border-indigo-900 ${
            collapsed ? "flex justify-center p-5" : "flex items-center justify-between p-6"
          }`}
        >
          {(!collapsed || mobileOpen) && (
            <div>
              <h1 className="text-xl font-extrabold tracking-wide flex items-center gap-2 text-indigo-400">
                <span>🛡️</span> FoodBridge AI
              </h1>
              <p className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase mt-0.5">
                {t("roles.admin")}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (window.innerWidth < 768 && setMobileOpen) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="text-2xl text-indigo-300 hover:text-white transition p-1"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center ${
                  collapsed && !mobileOpen ? "justify-center" : "gap-3"
                } px-6 py-4 hover:bg-indigo-900 transition ${
                  isActive ? "bg-indigo-900 font-bold border-r-4 border-indigo-400 text-indigo-300" : ""
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {(!collapsed || mobileOpen) && <span className="text-sm font-medium">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="border-t border-indigo-900 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-base font-extrabold shadow">
                {(user?.name || "Admin").charAt(0).toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate max-w-[130px]">{user?.name || "System Admin"}</p>
                <p className="text-[11px] text-indigo-300 font-semibold">{t("roles.admin")}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2 rounded-xl text-xs transition shadow border border-indigo-800"
            >
              🚪 {t("nav.logout")} Admin
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
