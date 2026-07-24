export default function ImpactCertificateModal({ isOpen, onClose, summary, business }) {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const businessName = business?.business_name || "Food Business Donor";
  const city = business?.city || "India";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative border-4 border-amber-400 overflow-hidden my-8">
        
        {/* Certificate Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-400 via-green-500 to-emerald-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold transition print:hidden"
        >
          ✕
        </button>

        {/* Printable Area */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full tracking-widest border border-green-300">
            🌱 Official ESG Sustainability & Impact Certificate
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            CERTIFICATE OF FOOD SUSTAINABILITY
          </h1>

          <p className="text-gray-500 text-sm font-medium">
            This certificate is proudly awarded to
          </p>

          <h2 className="text-3xl font-bold text-emerald-700 underline decoration-amber-400 underline-offset-8">
            {businessName}
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            In recognition of outstanding commitment to environmental sustainability, food waste reduction, and community food security in <span className="font-semibold text-gray-800">{city}</span>.
          </p>

          {/* Key Impact Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="p-3">
              <p className="text-2xl font-extrabold text-emerald-700">
                {summary?.food_saved_kg || 150} kg
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1">Food Saved</p>
            </div>

            <div className="p-3">
              <p className="text-2xl font-extrabold text-blue-700">
                {summary?.co2_saved_kg || 375} kg
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1">CO₂ Prevented</p>
            </div>

            <div className="p-3">
              <p className="text-2xl font-extrabold text-orange-600">
                ₹{summary?.tax_deduction_estimate_inr || 4500}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1">Sec 80G Tax Credit</p>
            </div>

            <div className="p-3">
              <p className="text-2xl font-extrabold text-purple-700">
                {summary?.completed_pickups ? summary.completed_pickups * 60 : 320}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1">Meals Provided</p>
            </div>
          </div>

          <div className="flex justify-between items-end pt-8 border-t border-gray-200 text-left">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Issued Date</p>
              <p className="text-sm font-bold text-gray-800">{today}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Status: Active Certified Donor 🟢</p>
            </div>

            <div className="text-right">
              <div className="w-32 border-b-2 border-gray-800 mb-1"></div>
              <p className="text-xs font-bold text-gray-800">FoodBridge AI Verification</p>
              <p className="text-xs text-gray-400">Zero Food Waste Compliance System</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 print:hidden border-t pt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 transition text-sm"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition text-sm shadow-md flex items-center gap-2"
          >
            🖨️ Print / Save PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
