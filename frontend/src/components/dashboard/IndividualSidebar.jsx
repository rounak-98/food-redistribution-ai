import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function IndividualSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { t } = useTranslation();

  const menu = [
    { name: t("nav.dashboard"), path: "/dashboard/individual", icon: "🏠" },
    { name: "My Donations", path: "/individual/donations", icon: "🍱" },
    { name: "Nearby NGOs", path: "/individual/ngos", icon: "🤝" },
    { name: "Badges & Rewards", path: "/individual/badges", icon: "🏆" },
    { name: t("nav.profile"), path: "/individual/profile", icon: "👤" },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");

  const accountName = profile?.full_name || user?.name || "Community Donor";
  const accountType = t("roles.individual");

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
        className={`fixed left-0 top-0 h-screen bg-teal-800 text-white flex flex-col transition-all duration-300 z-50 ${
          collapsed ? "md:w-20" : "md:w-64"
        } ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div
          className={`border-b border-teal-700 ${
            collapsed ? "flex justify-center p-5" : "flex items-center justify-between p-6"
          }`}
        >
          {(!collapsed || mobileOpen) && (
            <div>
              <h1 className="text-xl font-extrabold tracking-wide flex items-center gap-2">
                <span>🌱</span> FoodBridge AI
              </h1>
              <p className="text-[10px] text-teal-200 font-semibold tracking-wider uppercase mt-0.5">
                {t("roles.individual")}
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
            className="text-2xl hover:text-teal-200 transition p-1"
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
                } px-6 py-4 hover:bg-teal-700 transition ${
                  isActive ? "bg-teal-700 font-bold border-r-4 border-amber-400" : ""
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {(!collapsed || mobileOpen) && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="border-t border-teal-700 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white text-teal-800 flex items-center justify-center text-base font-extrabold shadow">
                {accountName.charAt(0).toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate max-w-[130px]">{accountName}</p>
                <p className="text-xs text-teal-200">{accountType}</p>
              </div>
            </div>

            <div className="text-xs text-teal-100 space-y-1 mb-4 truncate">
              <p className="truncate">📧 {user?.email || "user@example.com"}</p>
              <p>📞 {profile?.phone || "Not set"}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-white text-teal-800 font-bold py-2 rounded-xl text-xs hover:bg-teal-50 transition shadow"
            >
              🚪 {t("nav.logout")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
