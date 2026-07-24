export default function KPIStatCard({
  title,
  value,
  icon,
  color = "green",
  change = "+0%",
  subtitle = "",
}) {
  const gradients = {
    green: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    blue: "from-blue-600 to-indigo-600 shadow-blue-500/20",
    orange: "from-amber-500 to-orange-600 shadow-amber-500/20",
    red: "from-rose-500 to-red-600 shadow-rose-500/20",
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-100 hover-lift transition-all duration-300 relative overflow-hidden group">
      {/* Top accent glow line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[color]}`}></div>

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{title}</p>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h2>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {change}
            </span>
            {subtitle && <span className="text-[11px] font-medium text-slate-400">{subtitle}</span>}
          </div>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}