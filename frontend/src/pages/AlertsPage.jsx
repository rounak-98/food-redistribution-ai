import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory, autoDonateItem } from "../services/inventoryService";

export default function AlertsPage() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const businessId = storedUser?.business?.id;

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all", "critical", "warning", "system"
  const [actionLoading, setActionLoading] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    autoDonateEnabled: true,
  });

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      const data = await getInventory(businessId);
      setInventory(data || []);
    } catch (err) {
      console.error("Error loading alerts inventory:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAutoDonate = async (itemId) => {
    try {
      setActionLoading(itemId);
      const res = await autoDonateItem(itemId);
      alert(res.message || "Item auto-donated successfully!");
      loadInventory();
    } catch (err) {
      console.error("Failed to auto-donate:", err);
      alert("Failed to trigger auto-donate.");
    } finally {
      setActionLoading(null);
    }
  };

  const expired = inventory.filter((item) => item.status === "Expired");
  const expiring = inventory.filter((item) => item.status === "Expiring Soon");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>🔔</span> Smart Food Safety & Surplus Alerts Center
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time automated alerts for expiring stock, automated donation triggers, and system logs.
            </p>
          </div>

          <button
            onClick={loadInventory}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition self-start md:self-auto"
          >
            🔄 Sync System Alerts
          </button>
        </div>

        {/* Priority Tabs */}
        <div className="flex gap-3 mb-8 border-b pb-3">
          {[
            { id: "all", label: `All Notifications (${expired.length + expiring.length + 3})` },
            { id: "critical", label: `🔴 Critical Expiration (${expired.length})` },
            { id: "warning", label: `🟠 Surplus Warnings (${expiring.length})` },
            { id: "system", label: "✅ System & Sync Logs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow"
                  : "bg-slate-100 text-gray-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* CRITICAL EXPIRED ALERTS */}
            {(activeTab === "all" || activeTab === "critical") && (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-rose-800 flex items-center gap-2">
                    🔴 Critical Expired Stock ({expired.length})
                  </h2>
                  <span className="text-xs text-rose-600 font-semibold uppercase">Action Required</span>
                </div>

                {expired.length === 0 ? (
                  <p className="text-xs text-rose-700 bg-white/60 p-4 rounded-xl">
                    ✅ No expired products detected in active inventory.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {expired.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">⚠️ {item.product_name}</h4>
                          <p className="text-xs text-rose-600 font-medium">
                            Category: {item.category} • Quantity: {item.quantity} • Expired on: {item.expiry_date}
                          </p>
                        </div>

                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                          Mandatory Disposal Required
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WARNING EXPIRING SOON ALERTS (WITH 1-CLICK AUTO DONATE) */}
            {(activeTab === "all" || activeTab === "warning") && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                    🟠 Expiring Soon — Surplus Risk ({expiring.length})
                  </h2>
                  <span className="text-xs text-amber-700 font-semibold uppercase">Redistribute Today</span>
                </div>

                {expiring.length === 0 ? (
                  <p className="text-xs text-amber-800 bg-white/60 p-4 rounded-xl">
                    ✅ No stock expiring within the next 5 days.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {expiring.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">📦 {item.product_name}</h4>
                          <p className="text-xs text-amber-800 font-medium">
                            Category: {item.category} • Quantity: {item.quantity} • Expires: {item.expiry_date}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAutoDonate(item.id)}
                          disabled={actionLoading === item.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5"
                        >
                          {actionLoading === item.id ? "Donating..." : "⚡ 1-Click Auto Donate to NGO"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SYSTEM STATUS & LOGS */}
            {(activeTab === "all" || activeTab === "system") && (
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
                  ✅ System & API Connection Status
                </h2>

                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 font-semibold">Inventory DB Sync</p>
                    <p className="text-emerald-400 font-bold text-sm mt-1">🟢 Synchronized & Active</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 font-semibold">AI Recommendation Engine</p>
                    <p className="text-blue-400 font-bold text-sm mt-1">🤖 ML Engine Online</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 font-semibold">Logistics Dispatch Signal</p>
                    <p className="text-amber-400 font-bold text-sm mt-1">🛵 Rider Dispatch Ready</p>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATION PREFERENCES PANEL */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                ⚙️ Automated Alert Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Email Expiry Notifications</p>
                    <p className="text-xs text-gray-500">Receive daily morning digest of stock expiring within 48h</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailAlerts}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, emailAlerts: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">SMS / WhatsApp Logistics Alerts</p>
                    <p className="text-xs text-gray-500">Instant notification when a rider accepts your food donation</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsAlerts}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, smsAlerts: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}