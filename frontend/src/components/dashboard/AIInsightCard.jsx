export default function AIInsightCard({ inventory }) {

  const expired = inventory.filter(
    item => item.status === "Expired"
  );

  const expiring = inventory.filter(
    item => item.status === "Expiring Soon"
  );

  const fresh = inventory.filter(
    item => item.status === "Fresh"
  );

  return (

    <div className="bg-green-50 border border-green-200 rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        🤖 AI Recommendation
      </h2>

      {expired.length === 0 && expiring.length === 0 ? (

        <div>

          <p className="text-lg font-semibold text-green-700">
            ✅ Great Job!
          </p>

          <p className="mt-2 text-gray-700">
            No products require immediate attention.
          </p>

          <p className="mt-4">
            Inventory Health :
            <span className="font-bold text-green-700">
              {" "}Excellent
            </span>
          </p>

        </div>

      ) : (

        <div>

          {expired.length > 0 && (

            <p className="mb-3 text-red-600 font-semibold">
              🔴 {expired.length} expired product(s) require disposal.
            </p>

          )}

          {expiring.length > 0 && (

            <p className="mb-3 text-orange-600 font-semibold">
              🟠 {expiring.length} product(s) are expiring soon.
            </p>

          )}

          <div className="mt-5">

            <h3 className="font-bold mb-2">
              Recommended Action
            </h3>

            <ul className="list-disc ml-5 space-y-2">

              {expiring.map(item => (

                <li key={item.id}>
                  Donate <strong>{item.product_name}</strong> immediately.
                </li>

              ))}

              {expired.map(item => (

                <li key={item.id}>
                  Discard <strong>{item.product_name}</strong> according to food safety guidelines.
                </li>

              ))}

            </ul>

          </div>

          <div className="mt-6 bg-white rounded-xl p-4">

            <p className="font-semibold text-green-700">
              Inventory Summary
            </p>

            <p className="mt-2">
              🟢 Fresh : {fresh.length}
            </p>

            <p>
              🟠 Expiring Soon : {expiring.length}
            </p>

            <p>
              🔴 Expired : {expired.length}
            </p>

          </div>

        </div>

      )}

    </div>

  );

}