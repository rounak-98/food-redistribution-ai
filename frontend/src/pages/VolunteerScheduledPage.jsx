import { useEffect, useState } from "react";
import VolunteerDashboardLayout from "../components/dashboard/VolunteerDashboardLayout";
import { getVolunteerDashboard, acceptDeliveryTask } from "../services/volunteerService";

export default function VolunteerScheduledPage() {
  const [loading, setLoading] = useState(true);
  const [scheduled, setScheduled] = useState([]);

  useEffect(() => {
    loadScheduled();
  }, []);

  const loadScheduled = async () => {
    try {
      setLoading(true);
      const data = await getVolunteerDashboard();
      setScheduled(data.scheduled_deliveries || []);
    } catch (err) {
      console.error("Error loading scheduled deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (donationId) => {
    try {
      const res = await acceptDeliveryTask(donationId);
      alert(res.message);
      loadScheduled();
    } catch (err) {
      console.error("Error reserving scheduled delivery:", err);
    }
  };

  return (
    <VolunteerDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📅 Scheduled Advance Pickups</h1>
            <p className="text-gray-600 mt-1">
              Advance food surplus pickups scheduled for upcoming shifts & dates.
            </p>
          </div>

          <button
            onClick={loadScheduled}
            className="bg-amber-50 text-amber-900 font-bold px-4 py-2 rounded-xl hover:bg-amber-100 transition text-sm border border-amber-200"
          >
            🔄 Refresh Schedule
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : scheduled.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">📅</p>
            <h3 className="text-xl font-bold text-gray-800">No scheduled advance pickups</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Advance bakery surplus or planned event food pickups for upcoming days will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {scheduled.map((item) => (
              <div key={item.donation_id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-extrabold text-gray-900 text-lg">🍱 {item.food_name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} • Scheduled</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                    🗓️ Advance Pickup
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong className="text-gray-900">Donor:</strong> {item.donor_name} ({item.pickup_address})</p>
                  <p><strong className="text-gray-900">Destination:</strong> {item.dropoff_ngo_name} ({item.dropoff_address})</p>
                  <p className="text-orange-600 font-bold">⏰ Scheduled Time: {item.pickup_time}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleReserve(item.donation_id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                  >
                    📅 Reserve Scheduled Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VolunteerDashboardLayout>
  );
}
