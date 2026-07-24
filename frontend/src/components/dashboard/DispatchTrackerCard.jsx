import { useState } from "react";

export default function DispatchTrackerCard({ donations = [] }) {
  const safeDonations = Array.isArray(donations) ? donations : [];
  const [selectedId, setSelectedId] = useState(null);

  // Active or completed dispatches
  const activeList = safeDonations.length > 0 ? safeDonations : [
    {
      id: 101,
      food_name: "Surplus Fresh Meals (50 Portions)",
      quantity: "50 Meals",
      status: "In_Transit",
      pickup_otp: "4821",
      delivery_otp: "7913",
    },
  ];

  const currentDonation = activeList.find((d) => d.id === selectedId) || activeList[0];

  const steps = [
    { label: "Listed", icon: "📋" },
    { label: "Claimed by NGO", icon: "🤝" },
    { label: "Rider En Route", icon: "🛵" },
    { label: "Delivered", icon: "✅" },
  ];

  const getStepIndex = (status) => {
    if (!status) return 0;
    const s = String(status).toLowerCase().replace(/_/g, " ");
    if (s.includes("delivered") || s.includes("completed")) return 3;
    if (s.includes("transit") || s.includes("route")) return 2;
    if (s.includes("accepted") || s.includes("claimed")) return 1;
    return 0;
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase().replace(/_/g, " ");
    if (s.includes("delivered") || s.includes("completed")) {
      return <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-xl font-extrabold shadow">✅ Delivered</span>;
    }
    if (s.includes("transit") || s.includes("route")) {
      return <span className="bg-amber-500 text-slate-900 text-xs px-3 py-1 rounded-xl font-extrabold shadow animate-pulse">🚚 In Transit</span>;
    }
    if (s.includes("accepted") || s.includes("claimed")) {
      return <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-xl font-extrabold shadow">🤝 Claimed by NGO</span>;
    }
    return <span className="bg-slate-700 text-white text-xs px-3 py-1 rounded-xl font-extrabold shadow">📋 Available / Listed</span>;
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-8 border border-gray-100 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            🚚 Live Dispatch & 2-Step OTP Handover Tracker
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track real-time status and security verification OTP codes for all your surplus food donations.
          </p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-extrabold animate-pulse self-start sm:self-auto">
          ● {activeList.length} Active Pickup(s)
        </span>
      </div>

      {/* Multiple Donations Selector Pills */}
      {activeList.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          <p className="text-xs font-bold text-gray-500 w-full mb-1">Select Donation to Track:</p>
          {activeList.map((item, idx) => {
            const isSelected = item.id === currentDonation?.id;
            return (
              <button
                key={item.id || idx}
                onClick={() => setSelectedId(item.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow"
                    : "bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100"
                }`}
              >
                <span>🍱 {item.food_name || `Donation #${idx + 1}`}</span>
                <span className="text-[10px] opacity-75">({item.status || "Listed"})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Selected Donation Detail & Stepper */}
      {currentDonation ? (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Donation #{currentDonation.id || 1}
                </span>
                <span className="text-xs text-slate-400 font-mono">{currentDonation.food_category || "Surplus"}</span>
              </div>
              <p className="font-extrabold text-white text-xl">🍱 {currentDonation.food_name || "Food Surplus Batch"}</p>
              <p className="text-xs text-slate-300 mt-1">Quantity: {currentDonation.quantity || "Multiple Portions"}</p>
            </div>

            {/* OTP Display Boxes */}
            <div className="flex gap-3 bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <div className="text-center px-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Pickup OTP</span>
                <span className="text-xl font-mono font-extrabold text-white tracking-widest">
                  {currentDonation.pickup_otp || ((currentDonation.id || 1) * 137 + 4821) % 9000 + 1000}
                </span>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div className="text-center px-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Delivery OTP</span>
                <span className="text-xl font-mono font-extrabold text-white tracking-widest">
                  {currentDonation.delivery_otp || ((currentDonation.id || 1) * 243 + 7913) % 9000 + 1000}
                </span>
              </div>
            </div>

            <div className="text-right">
              {getStatusBadge(currentDonation.status)}
            </div>
          </div>

          {/* Dynamic 4-Step Progress Stepper */}
          {(() => {
            const stepIdx = getStepIndex(currentDonation.status);
            return (
              <div className="relative flex items-center justify-between pt-6 px-4">
                <div className="absolute left-8 right-8 top-10 h-1 bg-gray-200 -z-0"></div>
                <div
                  className="absolute left-8 top-10 h-1 bg-blue-600 transition-all duration-500 -z-0"
                  style={{
                    width: `${(stepIdx / (steps.length - 1)) * 88}%`,
                  }}
                ></div>

                {steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${
                        idx <= stepIdx
                          ? "bg-blue-600 text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-400 border border-gray-300"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-xs font-semibold mt-2.5 text-center ${
                        idx <= stepIdx ? "text-blue-900 font-extrabold" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-medium">No active pickups in dispatch right now.</p>
        </div>
      )}
    </div>
  );
}
