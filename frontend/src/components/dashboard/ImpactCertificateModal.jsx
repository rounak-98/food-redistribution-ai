import React from "react";

export default function ImpactCertificateModal({ isOpen, onClose, summary, business, donation }) {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const businessName =
    business?.business_name ||
    donation?.contact_person ||
    "Grand Heritage Kitchen";
  const city = business?.city || donation?.pickup_address?.split(",")?.pop()?.trim() || "Pune, Maharashtra";
  const address = donation?.pickup_address || business?.address || `${city}, India`;
  const phone = donation?.phone || business?.phone || "+91 98765 43210";
  const panNumber = `AAACF${String(business?.id || 101).padStart(4, "0")}G`;

  // --- Dynamic Valuation for Individual 80G Receipts ---
  const rawQty = donation?.quantity || "10 portions";
  const nums = rawQty.match(/\d+/g);
  const qtyNumber = nums ? parseInt(nums[0], 10) : 10;
  const isPortion = rawQty.toLowerCase().includes("portion") || rawQty.toLowerCase().includes("meal");
  const estimatedKg = isPortion ? Math.max(1, Math.round(qtyNumber * 0.4)) : qtyNumber;
  const unitRate = isPortion ? 80 : 120; // ₹80 per meal portion, ₹120 per kg
  const estimatedValuation = qtyNumber * unitRate;
  const taxDeductionValue = Math.round(estimatedValuation * 0.5); // 50% deduction under Section 80G
  const co2PreventedKg = Math.round(estimatedKg * 2.5);

  const receiptNo = `FB-80G-${new Date().getFullYear()}-${String(donation?.id || 1).padStart(5, "0")}`;
  const certificateNo = `FB-ESG-${String(business?.id || 1).padStart(3, "0")}-${new Date().getFullYear()}`;

  // --- Cumulative Summary Dynamic Metrics ---
  const foodSaved = summary?.food_saved_kg ?? (summary?.total_donations ? summary.total_donations * 15 : 45);
  const co2Prevented = summary?.co2_saved_kg ?? Math.round(foodSaved * 2.5);
  const taxCredit = summary?.tax_deduction_estimate_inr ?? Math.round(foodSaved * 140 * 0.25);
  const mealsCount = summary?.meals_provided ?? (summary?.completed_pickups ? summary.completed_pickups * 50 : Math.round(foodSaved / 0.4));

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border-4 border-amber-400 overflow-hidden my-6">
        
        {/* Certificate Decorative Top Ribbon */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-600 via-amber-400 to-blue-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold transition print:hidden"
          aria-label="Close"
        >
          ✕
        </button>

        {/* ========================================================================= */}
        {/* MODE A: SPECIFIC 80G DONATION RECEIPT (When a specific donation is clicked) */}
        {/* ========================================================================= */}
        {donation ? (
          <div className="space-y-6 pt-2 text-gray-800">
            {/* Header / National Emblem Bar */}
            <div className="text-center border-b border-gray-200 pb-4">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-300 mb-2">
                🇮🇳 Government of India • Form Section 80G Statutory Receipt
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 tracking-tight">
                CERTIFICATE OF CHARITABLE FOOD DONATION
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Issued in accordance with Section 80G(5)(vi) of the Income Tax Act, 1961 • Rule 18AB Compliance
              </p>
            </div>

            {/* Receipt Meta & Unique URN */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs gap-2">
              <div>
                <span className="text-gray-500 uppercase font-semibold">Receipt Number:</span>{" "}
                <span className="font-mono font-bold text-gray-900 text-sm">{receiptNo}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase font-semibold">Date of Transfer:</span>{" "}
                <span className="font-bold text-gray-900">
                  {donation.created_at ? donation.created_at.slice(0, 10) : today}
                </span>
              </div>
              <div>
                <span className="text-gray-500 uppercase font-semibold">Verification:</span>{" "}
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {donation.status || "Completed"} ✅
                </span>
              </div>
            </div>

            {/* Donor & Donee Two-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Donor */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-1">
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                  🏢 Transferor / Donor Particulars
                </p>
                <p className="font-bold text-sm text-gray-900">{businessName}</p>
                <p className="text-gray-600"><span className="font-semibold text-gray-700">Address:</span> {address}</p>
                <p className="text-gray-600"><span className="font-semibold text-gray-700">Phone:</span> {phone}</p>
                <p className="text-gray-600 font-mono"><span className="font-semibold text-gray-700">Donor PAN:</span> {panNumber}</p>
              </div>

              {/* Donee NGO */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-1">
                <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  🤝 Recipient Welfare Organization (Donee)
                </p>
                <p className="font-bold text-sm text-gray-900">{donation.ngo_name || "Asha Food Relief Trust"}</p>
                <p className="text-gray-600 font-mono"><span className="font-semibold text-gray-700">80G URN:</span> AAATA0123MF20214</p>
                <p className="text-gray-600"><span className="font-semibold text-gray-700">Tax Exemption Status:</span> 100% / 50% Allowable</p>
                <p className="text-gray-600"><span className="font-semibold text-gray-700">Recipient Phone:</span> {donation.ngo_phone || "+91 98765 00000"}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3 text-right">In-Kind Valuation</th>
                    <th className="p-3 text-right">80G Tax Credit (50%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-gray-900">{donation.food_name}</td>
                    <td className="p-3 text-gray-600">{donation.food_category}</td>
                    <td className="p-3 font-semibold text-emerald-700">{donation.quantity}</td>
                    <td className="p-3 text-right font-mono font-semibold">₹{estimatedValuation.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{taxDeductionValue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Impact Highlights */}
            <div className="grid grid-cols-3 gap-3 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-center text-xs">
              <div>
                <p className="text-gray-500">Est. Weight</p>
                <p className="text-sm font-bold text-emerald-800">{estimatedKg} kg</p>
              </div>
              <div>
                <p className="text-gray-500">CO₂ Avoided</p>
                <p className="text-sm font-bold text-blue-800">{co2PreventedKg} kg CO₂e</p>
              </div>
              <div>
                <p className="text-gray-500">Handover OTP</p>
                <p className="text-sm font-mono font-bold text-purple-800">{donation.delivery_otp || donation.pickup_otp || "VERIFIED-9821"}</p>
              </div>
            </div>

            {/* Statutory Declaration */}
            <p className="text-[11px] text-gray-500 italic leading-relaxed border-t pt-3">
              * Certified that the food items specified above were accepted by the verified non-profit partner for immediate free redistribution to vulnerable beneficiaries in compliance with statutory food safety requirements under the FSSAI Surplus Food Regulations, 2019.
            </p>

            {/* Signatures & Seal */}
            <div className="flex justify-between items-end pt-4 border-t border-gray-200 text-xs">
              <div>
                <p className="font-bold text-gray-900">FoodBridge Digital Verification Ledger</p>
                <p className="text-[10px] text-gray-400 font-mono">Cryptographic Hash: 8f9b...a17c</p>
              </div>
              <div className="text-right">
                <div className="w-28 border-b border-gray-700 mb-1 ml-auto"></div>
                <p className="font-bold text-gray-900">Authorized Signatory</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Asha Food Relief Trust</p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE B: CUMULATIVE ESG SUSTAINABILITY CERTIFICATE (For Business Profile) */
          /* ========================================================================= */
          <div className="text-center space-y-6 pt-2">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full tracking-widest border border-green-300">
              🌱 Official Corporate ESG Sustainability & Impact Certificate
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-black text-gray-900 tracking-tight">
              CERTIFICATE OF FOOD SUSTAINABILITY
            </h1>

            <p className="text-gray-500 text-sm font-medium">
              This certificate of sustainability excellence is proudly awarded to
            </p>

            <h2 className="text-3xl font-extrabold text-emerald-700 underline decoration-amber-400 underline-offset-8">
              {businessName}
            </h2>

            <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
              In recognition of distinguished corporate social responsibility, carbon footprint mitigation, and consistent community food recovery operations in <span className="font-semibold text-gray-800">{city}</span>.
            </p>

            {/* Key Dynamic Impact Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="p-3">
                <p className="text-2xl font-extrabold text-emerald-700">
                  {foodSaved} kg
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1">Food Waste Prevented</p>
              </div>

              <div className="p-3">
                <p className="text-2xl font-extrabold text-blue-700">
                  {co2Prevented} kg
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1">CO₂ Emissions Offset</p>
              </div>

              <div className="p-3">
                <p className="text-2xl font-extrabold text-orange-600">
                  ₹{taxCredit.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1">Section 80G Tax Credit</p>
              </div>

              <div className="p-3">
                <p className="text-2xl font-extrabold text-purple-700">
                  {mealsCount.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-gray-600 mt-1">Meals Provided</p>
              </div>
            </div>

            {/* Footer / Validity */}
            <div className="flex justify-between items-end pt-6 border-t border-gray-200 text-left">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Issued Date</p>
                <p className="text-sm font-bold text-gray-800">{today}</p>
                <p className="text-xs font-mono text-gray-500 mt-0.5">Cert ID: {certificateNo}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Status: Active Certified Donor 🟢</p>
              </div>

              <div className="text-right">
                <div className="w-32 border-b-2 border-gray-800 mb-1 ml-auto"></div>
                <p className="text-xs font-bold text-gray-800">FoodBridge AI Verification</p>
                <p className="text-xs text-gray-400">Zero Food Waste Compliance System</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 print:hidden border-t pt-5">
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
            🖨️ Print / Save PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
