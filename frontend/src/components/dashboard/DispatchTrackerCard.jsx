export default function DispatchTrackerCard({ donations }) {
  const activeDonation = donations?.find(
    (d) => d.status === "Accepted" || d.status === "In Transit" || d.status === "Available"
  ) || donations?.[0];

  const steps = [
    { label: "Listed", icon: "📋" },
    { label: "Claimed by NGO", icon: "🤝" },
    { label: "Rider En Route", icon: "🛵" },
    { label: "Delivered", icon: "✅" },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case "Available":
        return 0;
      case "Accepted":
        return 1;
      case "In Transit":
        return 2;
      case "Completed":
        return 3;
      default:
        return 1;
    }
  };

  const currentIndex = activeDonation ? getStepIndex(activeDonation.status) : 0;

  // Generate deterministic OTP display for active donation demo
  const pickupOTP = activeDonation ? (activeDonation.id * 137 + 4821) % 9000 + 1000 : "4821";
  const deliveryOTP = activeDonation ? (activeDonation.id * 243 + 7913) % 9000 + 1000 : "7913";

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🚚 Live Dispatch & OTP Handover Tracker
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time status of active food surplus pickups with 2-step OTP security verification
          </p>
        </div>
        <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
          ● Live Verification Active
        </span>
      </div>

      {activeDonation ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-100">
            <div>
              <p className="font-bold text-blue-900 text-base">🍱 {activeDonation.food_name}</p>
              <p className="text-xs text-blue-700 mt-0.5">Quantity: {activeDonation.quantity}</p>
            </div>

            {/* OTP Display Box for Handover */}
            <div className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-blue-200">
              <div className="text-center px-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Pickup OTP</span>
                <span className="text-lg font-mono font-extrabold text-blue-600 tracking-widest">{pickupOTP}</span>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="text-center px-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Delivery OTP</span>
                <span className="text-lg font-mono font-extrabold text-emerald-600 tracking-widest">{deliveryOTP}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow">
                {activeDonation.status}
              </span>
            </div>
          </div>

          {/* Stepper Component */}
          <div className="relative flex items-center justify-between pt-4 px-2">
            <div className="absolute left-6 right-6 top-7 h-1 bg-gray-200 -z-0"></div>
            <div
              className="absolute left-6 top-7 h-1 bg-blue-600 transition-all duration-500 -z-0"
              style={{
                width: `${(currentIndex / (steps.length - 1)) * 85}%`,
              }}
            ></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    idx <= currentIndex
                      ? "bg-blue-600 text-white shadow-md scale-110"
                      : "bg-gray-100 text-gray-400 border border-gray-300"
                  }`}
                >
                  {step.icon}
                </div>
                <p
                  className={`text-xs font-semibold mt-2 text-center ${
                    idx <= currentIndex ? "text-blue-900 font-bold" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
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
