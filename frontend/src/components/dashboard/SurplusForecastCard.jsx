export default function SurplusForecastCard() {
  const forecastDays = [
    { day: "Mon", surplusKg: 12, risk: "Low", color: "bg-gradient-to-t from-emerald-600 to-emerald-400" },
    { day: "Tue", surplusKg: 18, risk: "Low", color: "bg-gradient-to-t from-emerald-600 to-emerald-400" },
    { day: "Wed", surplusKg: 25, risk: "Medium", color: "bg-gradient-to-t from-amber-600 to-amber-400" },
    { day: "Thu", surplusKg: 30, risk: "Medium", color: "bg-gradient-to-t from-amber-600 to-amber-400" },
    { day: "Fri", surplusKg: 65, risk: "High Surplus Risk", color: "bg-gradient-to-t from-rose-600 to-rose-400" },
    { day: "Sat", surplusKg: 80, risk: "High Surplus Risk", color: "bg-gradient-to-t from-rose-600 to-rose-400" },
    { day: "Sun", surplusKg: 45, risk: "Medium", color: "bg-gradient-to-t from-amber-600 to-amber-400" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            🔮 AI Surplus Day Forecast & Predictive Risk
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Machine Learning predictive model based on historical inventory & week trends
          </p>
        </div>
        <span className="bg-purple-100 text-purple-800 text-xs px-3.5 py-1.5 rounded-full font-extrabold self-start sm:self-auto border border-purple-200">
          🤖 ML Predictor
        </span>
      </div>

      {/* Forecast Bars */}
      <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4 pb-2 border-b border-slate-100">
        {forecastDays.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[11px] font-extrabold text-slate-700">{item.surplusKg}kg</span>
            <div
              className={`w-full max-w-[32px] rounded-t-xl transition-all duration-500 shadow-sm group-hover:scale-105 ${item.color}`}
              style={{ height: `${(item.surplusKg / 80) * 100}%` }}
            ></div>
            <span className="text-xs font-bold text-slate-600 mt-1">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 bg-purple-50/80 p-4 rounded-2xl border border-purple-100 gap-3">
        <span className="font-semibold text-purple-950">
          💡 <strong className="text-purple-900">Peak Surplus Warning:</strong> Friday & Saturday are forecasted to generate up to 145 kg surplus.
        </span>
        <span className="text-purple-700 hover:text-purple-900 underline font-bold whitespace-nowrap cursor-pointer">
          Set Pre-Donation Alert →
        </span>
      </div>
    </div>
  );
}
