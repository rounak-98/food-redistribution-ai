export default function SurplusForecastCard() {
  const forecastDays = [
    { day: "Mon", surplusKg: 12, risk: "Low", color: "bg-green-500" },
    { day: "Tue", surplusKg: 18, risk: "Low", color: "bg-green-500" },
    { day: "Wed", surplusKg: 25, risk: "Medium", color: "bg-amber-500" },
    { day: "Thu", surplusKg: 30, risk: "Medium", color: "bg-amber-500" },
    { day: "Fri", surplusKg: 65, risk: "High Surplus Risk", color: "bg-red-500" },
    { day: "Sat", surplusKg: 80, risk: "High Surplus Risk", color: "bg-red-500" },
    { day: "Sun", surplusKg: 45, risk: "Medium", color: "bg-amber-500" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🔮 AI Surplus Day Forecast & Risk Analysis
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Machine Learning predictive model based on historical inventory & week trends
          </p>
        </div>
        <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
          🤖 ML Predictor
        </span>
      </div>

      {/* Forecast Bars */}
      <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 pb-2 border-b border-gray-100">
        {forecastDays.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
            <span className="text-[10px] font-bold text-gray-600">{item.surplusKg}kg</span>
            <div
              className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${item.color}`}
              style={{ height: `${(item.surplusKg / 80) * 100}%` }}
            ></div>
            <span className="text-xs font-semibold text-gray-800">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 bg-purple-50 p-3 rounded-xl border border-purple-100">
        <span className="font-semibold text-purple-900">
          💡 Peak Surplus Warning: <span className="font-bold">Friday & Saturday</span> are forecasted to generate up to 145 kg surplus.
        </span>
        <span className="text-purple-700 underline font-medium cursor-pointer">
          Set Pre-Donation Alert →
        </span>
      </div>
    </div>
  );
}
