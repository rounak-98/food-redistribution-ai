import LanguageSelector from "../LanguageSelector";
import PWAInstallPrompt from "../PWAInstallPrompt";
import { useTranslation } from "react-i18next";
import { FaBars } from "react-icons/fa";

export default function Topbar({ onToggleMobileMenu }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");

  const role = user?.role?.toLowerCase();

  let accountName = user?.name || "User";
  let accountType = "Business Account";

  if (role === "ngo") {
    accountName = profile?.ngo_name || user?.name || "NGO Partner";
    accountType = t("roles.ngo");
  } else if (role === "individual") {
    accountName = profile?.full_name || user?.name || "Individual Donor";
    accountType = t("roles.individual");
  } else if (role === "volunteer") {
    accountName = profile?.full_name || user?.name || "Transport Rider";
    accountType = t("roles.volunteer");
  } else if (role === "admin") {
    accountName = user?.name || "System Admin";
    accountType = t("roles.admin");
  } else if (role === "business") {
    accountName = profile?.business_name || user?.name || "Business Partner";
    accountType = t("roles.business");
  }

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 px-4 py-3 sm:px-8 sm:py-4 flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-slate-700 hover:text-indigo-600 p-2 rounded-xl border border-slate-200 bg-slate-50 transition"
          aria-label="Toggle Mobile Menu"
        >
          <FaBars className="text-lg" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {t("app_name")}
          </h1>

          <p className="text-slate-500 text-xs hidden sm:block mt-0.5">
            {t("welcome_back")}, <span className="font-bold text-slate-900">{accountName}</span> 👋
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <LanguageSelector />

        <div className="text-right hidden sm:block">
          <p className="font-bold text-slate-900 text-sm">{accountName}</p>
          <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">{accountType}</p>
        </div>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md border border-indigo-500">
          {accountName.charAt(0).toUpperCase()}
        </div>
      </div>

      <PWAInstallPrompt />
    </header>
  );
}