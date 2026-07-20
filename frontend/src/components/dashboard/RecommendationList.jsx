export default function RecommendationList({ recommendations }) {

    const getStyle = (text) => {

        const lower = text.toLowerCase();

        if (lower.includes("remove") || lower.includes("expired")) {
            return {
                icon: "🔴",
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-700"
            };
        }

        if (
            lower.includes("donate") ||
            lower.includes("expiry") ||
            lower.includes("expiring")
        ) {
            return {
                icon: "🟡",
                bg: "bg-yellow-50",
                border: "border-yellow-200",
                text: "text-yellow-700"
            };
        }

        return {
            icon: "🟢",
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700"
        };
    };

    return (

        <div className="mt-8">

            <div className="flex items-center justify-between mb-4">

                <h3 className="text-xl font-bold">
                    🤖 AI Recommendations
                </h3>

                <span className="text-sm text-gray-500">
                    {recommendations.length} Suggestion(s)
                </span>

            </div>

            <div className="space-y-4">

                {recommendations.map((item, index) => {

                    const style = getStyle(item);

                    return (

                        <div
                            key={index}
                            className={`
                                ${style.bg}
                                ${style.border}
                                border
                                rounded-xl
                                p-4
                                flex
                                items-start
                                gap-4
                                shadow-sm
                                hover:shadow-md
                                transition-all
                                duration-300
                            `}
                        >

                            <div className="text-2xl">
                                {style.icon}
                            </div>

                            <p className={`font-medium ${style.text}`}>
                                {item}
                            </p>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}