import { useEffect, useState } from "react";
import IndividualDashboardLayout from "../components/dashboard/IndividualDashboardLayout";
import { getIndividualDashboard } from "../services/individualService";

export default function IndividualNGOsPage() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      setLoading(true);
      const data = await getIndividualDashboard();
      setNgos(data.nearby_ngos || []);
    } catch (err) {
      console.error("Error loading nearby NGOs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = ngos.filter(
    (ngo) =>
      ngo.ngo_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IndividualDashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🤝 Nearby Verified NGOs & Food Banks</h1>
            <p className="text-gray-600 mt-1">
              Find verified local food redistribution centers, shelters, and drop-off points near you.
            </p>
          </div>

          <button
            onClick={loadNGOs}
            className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl hover:bg-emerald-100 transition self-start md:self-auto text-sm"
          >
            🔄 Refresh Directory
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <input
            type="text"
            placeholder="🔍 Search NGO name, city, or contact person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-4">🏢</p>
            <h3 className="text-xl font-bold text-gray-800">No NGOs found matching your search</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Check back soon as new verified NGO partners register in your city!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Verified Partner
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                      📍 {ngo.distance_km ? `${ngo.distance_km} km` : "Nearby"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">🏢 {ngo.ngo_name}</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Contact Person: <span className="font-semibold text-gray-800">{ngo.contact_person}</span>
                  </p>

                  <div className="space-y-2 text-xs text-gray-600 bg-slate-50 p-4 rounded-xl">
                    <p><strong className="text-gray-800">🏠 Drop-off Address:</strong> {ngo.address}</p>
                    <p><strong className="text-gray-800">📞 Phone:</strong> {ngo.phone}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`tel:${ngo.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5"
                  >
                    📞 Call NGO
                  </a>
                  <span className="text-xs text-emerald-600 font-semibold">Accepting Surplus</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </IndividualDashboardLayout>
  );
}
