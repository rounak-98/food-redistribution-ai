export default function QuickActionCard({ title, icon }) {
  return (
    <button
      className="bg-white rounded-2xl shadow-md p-6 hover:bg-green-50 hover:shadow-lg transition text-left w-full"
    >
      <div className="text-4xl mb-3">
        {icon}
      </div>

      <h3 className="font-bold text-lg">
        {title}
      </h3>
    </button>
  );
}