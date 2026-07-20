export default function HealthProgress({ score }) {

    let color = "bg-red-500";
    let status = "Critical";
    let textColor = "text-red-600";

    if (score >= 90) {
        color = "bg-green-500";
        status = "Excellent";
        textColor = "text-green-600";
    } else if (score >= 75) {
        color = "bg-green-400";
        status = "Healthy";
        textColor = "text-green-600";
    } else if (score >= 60) {
        color = "bg-yellow-500";
        status = "Needs Attention";
        textColor = "text-yellow-600";
    }

    return (

        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border">

            <div className="flex justify-between items-center">

                <div>

                    <h3 className="font-semibold text-gray-800">
                        Inventory Health
                    </h3>

                    <p className={`text-sm font-medium ${textColor}`}>
                        {status}
                    </p>

                </div>

                <div className={`text-3xl font-bold ${textColor}`}>
                    {score}%
                </div>

            </div>

            <div className="mt-4 w-full h-4 bg-gray-200 rounded-full overflow-hidden">

                <div
                    className={`${color} h-4 rounded-full transition-all duration-1000`}
                    style={{
                        width: `${score}%`
                    }}
                />

            </div>

        </div>

    );

}