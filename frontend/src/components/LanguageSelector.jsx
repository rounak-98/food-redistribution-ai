import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
  };

  return (
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
  );
}
