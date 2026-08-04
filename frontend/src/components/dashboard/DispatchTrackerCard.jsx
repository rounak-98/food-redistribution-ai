import { useTranslation } from "react-i18next";
import { FaTruck, FaMapMarkerAlt, FaCheckCircle, FaClock, FaPhoneAlt } from "react-icons/fa";

export default function DispatchTrackerCard({ donations = [] }) {
  const { t } = useTranslation();
  const safeDonations = Array.isArray(donations) ? donations : [];

  const activeDispatches = safeDonations.filter(
    (d) => d.status === "Claimed" || d.status === "In Transit" || d.status === "Assigned" || d.status === "Completed"
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FaTruck className="text-indigo-600 text-xl" />
            {t("cards.dispatch_tracker")}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {t("cards.dispatch_subtitle")}
          </p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full border border-indigo-200">
          Live Transport
        </span>
      </div>

      {activeDispatches.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <FaClock className="mx-auto text-3xl text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700">No active dispatches right now</p>
          <p className="text-xs text-slate-400 mt-0.5">When an NGO or volunteer claims a donation, real-time pickup details appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {activeDispatches.map((item, idx) => {
            const isCompleted = item.status === "Completed" || item.status === "Delivered";
            const isInTransit = item.status === "In Transit" || item.status === "Assigned";

            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                      🍱 {item.food_name || "Food Shipment"}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ({item.quantity})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-red-500 text-xs shrink-0" />
                    <span>Recipient NGO: <strong>{item.ngo_name || item.claimed_by || "Verified NGO Shelter"}</strong></span>
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <FaPhoneAlt className="text-indigo-500 text-xs shrink-0" />
                    <span>Contact: {item.ngo_phone || "+91 98765 43210"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full border ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isInTransit
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {isCompleted ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs animate-spin" />}
                      {item.status || "Claimed"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">Rider ID: VR-8492</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
