import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMobileAlt, FaTimes } from "react-icons/fa";

export default function PWAInstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isStandaloneApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://");
    setIsStandalone(isStandaloneApp);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandaloneApp) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted PWA installation");
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl p-5 border border-slate-700 animate-slide-up flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
            <FaMobileAlt />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-100">{t("pwa.install_title")}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t("pwa.install_desc")}</p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-slate-400 hover:text-white p-1 transition"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>

      <button
        onClick={handleInstallClick}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
      >
        {t("pwa.install_btn")}
      </button>
    </div>
  );
}
