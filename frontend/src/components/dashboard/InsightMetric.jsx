export default function InsightMetric({

    icon,

    title,

    value,

    color

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                shadow-sm
                p-5
                transition-all
                duration-300
                hover:shadow-lg
                hover:-translate-y-1
            "
        >

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-gray-800">
                        {value}
                    </h2>

                </div>

                <div
                    className={`
                        w-14 h-14
                        rounded-xl
                        flex items-center justify-center
                        text-3xl
                        bg-gray-50
                        ${color}
                    `}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}