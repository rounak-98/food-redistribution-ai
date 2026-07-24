import { useEffect, useState } from "react";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { getAcceptedDonations, completeDonation } from "../services/ngoService";

export default function AcceptedDonationsPage() {
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadAcceptedDonations();
  }, []);

  const loadAcceptedDonations = async () => {
    try {
      setLoading(true);
      const data = await getAcceptedDonations();
      setAcceptedDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load accepted donations:", error);
      setAcceptedDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id, isOtpVerified) => {
    if (!isOtpVerified) {
      alert("⚠️ Cannot complete donation directly! The transport rider must enter and verify the 4-digit Delivery Handover OTP upon dropoff.");
      return;
    }
    try {
      setActionLoading(id);
      const res = await completeDonation(id);
      alert(res.message || "Donation marked as completed!");
      loadAcceptedDonations();
    } catch (error) {
      console.error("Failed to mark donation as completed:", error);
      alert(error.response?.data?.detail || "Delivery OTP must be verified before completing donation.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              ✅ Accepted Food Donations & Delivery Handover
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Active food donations claimed by your NGO. Track rider dispatch status and view your 4-digit Delivery Handover OTP.
            </p>
          </div>

          <button
            onClick={loadAcceptedDonations}
            className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-blue-100 transition self-start md:self-auto text-xs"
          >
            🔄 Refresh Tracker
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : acceptedDonations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="text-xl font-bold text-gray-800">No active accepted donations</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
              You haven't accepted any food donations currently in progress. Browse available donations to claim food surplus!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {acceptedDonations.map((item) => {
              const deliveryOTP = item.delivery_otp || ((item.id * 243 + 7913) % 9000 + 1000);
              const rider = item.rider;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-blue-300 transition-all space-y-6"
                >
                  {/* Top Header Card */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          Donation #{item.id}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Category: {item.food_category}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-900">🍱 {item.food_name}</h3>
                      <p className="text-xs text-blue-600 font-bold mt-0.5">Quantity: {item.quantity}</p>
                    </div>

                    {/* Delivery OTP Handover Badge for NGO */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 rounded-2xl shadow-md flex items-center gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                          🔑 Handover Delivery OTP
                        </span>
                        <span className="text-2xl font-mono font-extrabold tracking-widest leading-none">
                          {deliveryOTP}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-100 max-w-[130px] text-right font-medium">
                        Provide this 4-digit code to the rider at dropoff
                      </span>
                    </div>
                  </div>

                  {/* Body Content Grid */}
                  <div className="grid md:grid-cols-3 gap-6 text-xs text-gray-600">
                    {/* Donor Details */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                      <p className="font-extrabold text-gray-900 uppercase text-[11px] text-slate-400">🏢 Donor Business</p>
                      <p className="font-bold text-gray-900 text-sm">{item.business?.business_name || "Food Donor"}</p>
                      <p className="text-gray-600">📍 {item.pickup_address}</p>
                      <p className="text-blue-600 font-semibold">📞 Phone: {item.phone || item.business?.phone || "N/A"}</p>
                      <p className="text-amber-700 font-semibold mt-1">⏰ Pickup Schedule: {item.pickup_time || "Immediate"}</p>
                    </div>

                    {/* Rider Logistics Tracking */}
                    <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-1.5">
                      <p className="font-extrabold text-blue-900 uppercase text-[11px] tracking-wider">🛵 Transport Rider Status</p>
                      {rider ? (
                        <>
                          <p className="font-bold text-blue-950 text-sm">👤 {rider.name}</p>
                          <p className="text-blue-800 font-medium">📞 Phone: <a href={`tel:${rider.phone}`} className="underline font-bold">{rider.phone}</a></p>
                          <p className="text-blue-700">Vehicle: {rider.vehicle}</p>
                          <span className="inline-block bg-amber-500 text-slate-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mt-1">
                            🚚 Rider Status: {rider.status || "Assigned"}
                          </span>
                        </>
                      ) : (
                        <div>
                          <p className="font-bold text-slate-700 text-sm">🛵 Pending Rider Assignment</p>
                          <p className="text-slate-500 mt-1">Nearby volunteer transport riders can view and accept this delivery task.</p>
                          <span className="inline-block bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mt-2">
                            ● Dispatching Rider
                          </span>
                        </div>
                      )}
                    </div>

                    {/* NGO Action & Handover Status */}
                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="font-extrabold text-emerald-900 uppercase text-[11px] tracking-wider">🏁 Handover Status</p>
                        <p className="text-emerald-800 text-xs mt-1 font-medium">
                          Status: <strong className="uppercase">{item.status}</strong>
                        </p>
                        {item.delivery_otp_verified ? (
                          <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                            ✓ OTP Handover Verified
                          </span>
                        ) : (
                          <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 border border-amber-200">
                            ⚠️ Rider OTP Verification Required
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleComplete(item.id, item.delivery_otp_verified)}
                        disabled={actionLoading === item.id}
                        className={`font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition text-center w-full ${
                          item.delivery_otp_verified
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-slate-300 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        {actionLoading === item.id ? "Updating..." : item.delivery_otp_verified ? "🎉 Confirm Delivery & Complete" : "🔒 Awaiting Rider OTP Verification"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </NGODashboardLayout>
  );
}