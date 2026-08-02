import { useTranslation } from "react-i18next";
import { FaGlobe, FaDownload } from "react-icons/fa";
import { useEffect, useState } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      alert("📲 FoodBridge App Installation:\n\nTo install this app on your device:\n1. On Mobile: Tap your browser menu (⋮ or share icon) and select 'Add to Home Screen'.\n2. On Desktop: Click the install icon (⊕) on the right side of your address bar!");
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Language Selector Dropdown */}
      <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 transition-all">
        <FaGlobe className="text-indigo-600 text-sm" />
        <select
          value={i18n.language ? i18n.language.split("-")[0] : "en"}
          onChange={handleLanguageChange}
          className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-1"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-900 font-bold">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* PWA App Install Button */}
      <button
        onClick={handleInstallPWA}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-emerald-400"
      >
        <FaDownload className="text-xs" />
        <span>{t("pwa.install_btn") || "📲 Install App"}</span>
      </button>
    </div>
  );
}
