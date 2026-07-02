export default function AIInsightCard() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        🤖 AI Insight
      </h2>

      <p className="text-gray-700 leading-7">
        Based on previous donation trends and inventory,
        FoodBridge AI predicts a high probability of surplus
        food tomorrow.
      </p>

      <div className="mt-6">

        <p>
          🍞 Bread : High
        </p>

        <p>
          🍚 Rice : Medium
        </p>

        <p>
          🥗 Vegetables : Low
        </p>

      </div>

      <div className="mt-6 font-semibold text-green-700">
        Suggested Donation Time:
        <br />
        6 PM - 8 PM
      </div>

    </div>
  );
}