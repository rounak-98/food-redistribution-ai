import { useNavigate } from "react-router-dom";

export default function QuickActionCard({ title, icon = "⚡", path, link, description, buttonText }) {
  const navigate = useNavigate();
  const targetPath = path || link;

  return (
    <button
      onClick={() => targetPath && navigate(targetPath)}
      className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-100 hover-lift transition-all duration-300 text-left w-full group relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center text-2xl shadow-sm">
          {icon}
        </div>
        <span className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 font-bold text-lg">
          →
        </span>
      </div>

      <div>
        <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            {description}
          </p>
        )}

        {buttonText && (
          <span className="inline-block mt-3 text-xs font-extrabold text-indigo-600 group-hover:underline">
            {buttonText} →
          </span>
        )}
      </div>
    </button>
  );
}