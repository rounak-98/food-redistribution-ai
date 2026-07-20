import HealthProgress from "./HealthProgress";
import InsightMetric from "./InsightMetric";
import RecommendationList from "./RecommendationList";

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

    const total = inventory.length;

    const healthScore =
        total === 0
            ? 100
            : Math.round(
                ((fresh.length + expiring.length * 0.5) / total) * 100
            );

    const wasteRisk =
        total === 0
            ? 0
            : Math.round((expired.length / total) * 100);

    let assessment = "Critical";

    if (healthScore >= 90)
        assessment = "Excellent";
    else if (healthScore >= 75)
        assessment = "Healthy";
    else if (healthScore >= 60)
        assessment = "Needs Attention";

    let priority = "Low";

    if (expiring.length > 5)
        priority = "High";
    else if (expiring.length > 2)
        priority = "Medium";

    const recommendations = [];

    if (expiring.length > 0)
        recommendations.push(
            `Donate ${expiring.length} product(s) nearing expiry.`
        );

    if (expired.length > 0)
        recommendations.push(
            `Remove ${expired.length} expired product(s) immediately.`
        );

    if (fresh.length > total * 0.8)
        recommendations.push(
            "Inventory is in excellent condition."
        );

    if (recommendations.length === 0)
        recommendations.push(
            "No immediate action required."
        );

    return (

        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-8 border">

            <h2 className="text-2xl font-bold text-green-700">

                🧠 FoodBridge Intelligence

            </h2>

            <p className="text-gray-500 mt-2">

                AI powered inventory monitoring and recommendations

            </p>

            <HealthProgress score={healthScore} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

                <InsightMetric
                    icon="🟢"
                    title="Fresh Items"
                    value={fresh.length}
                    color="text-green-500"
                />

                <InsightMetric
                    icon="🟠"
                    title="Expiring Soon"
                    value={expiring.length}
                    color="text-orange-500"
                />

                <InsightMetric
                    icon="🔴"
                    title="Expired"
                    value={expired.length}
                    color="text-red-500"
                />

                <InsightMetric
                    icon="⚠️"
                    title="Waste Risk"
                    value={`${wasteRisk}%`}
                    color="text-red-500"
                />

            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">

                <div className="bg-white rounded-xl p-4 shadow-sm border">

                    <p className="text-gray-500">
                        AI Assessment
                    </p>

                    <h3 className="text-xl font-bold text-green-700 mt-2">

                        {assessment}

                    </h3>

                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">

                    <p className="text-gray-500">
                        Donation Priority
                    </p>

                    <h3 className="text-xl font-bold text-orange-600 mt-2">

                        {priority}

                    </h3>

                </div>

            </div>

            <RecommendationList
                recommendations={recommendations}
            />

        </div>

    );

}