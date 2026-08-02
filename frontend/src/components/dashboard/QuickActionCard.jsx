import { useNavigate } from "react-router-dom";

export default function QuickActionCard({ title, icon = "⚡", path, link, description, buttonText, onClick }) {
  const navigate = useNavigate();
  const targetPath = path || link;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (targetPath && targetPath !== "#") {
      navigate(targetPath);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm hover:shadow-md border border-slate-100 hover-lift transition-all duration-300 text-left w-full group relative overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center text-lg sm:text-2xl shadow-sm">
          {icon}
        </div>
        <span className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 font-bold text-sm sm:text-lg">
          →
        </span>
      </div>

      <div>
        <h3 className="font-bold sm:font-extrabold text-slate-900 text-xs sm:text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
          {title}
        </h3>

        {description && (
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium leading-tight line-clamp-2 hidden xs:block">
            {description}
          </p>
        )}

        {buttonText && (
          <span className="inline-block mt-2 sm:mt-3 text-[10px] sm:text-xs font-extrabold text-indigo-600 group-hover:underline">
            {buttonText} →
          </span>
        )}
      </div>
    </button>
  );
}