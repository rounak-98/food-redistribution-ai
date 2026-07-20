import CountUp from "react-countup";

export default function KPIStatCard({
  title,
  value,
  icon,
  color = "green",
  change = "+0%",
  subtitle = "",
}) {
  const colors = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-amber-600",
    red: "from-red-500 to-pink-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-green-600 font-semibold mt-2">
            {change}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-3xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}