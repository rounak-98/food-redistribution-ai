import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function CategoryBarChart({ inventory = [] }) {
  const { t } = useTranslation();
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const categoryMap = {};
  safeInventory.forEach((item) => {
    const cat = item.food_category || item.category || "General Meals";
    categoryMap[cat] = (categoryMap[cat] || 0) + (parseInt(item.quantity) || 1);
  });

  let data = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    quantity: categoryMap[cat],
  }));

  if (data.length === 0) {
    data = [
      { category: "Bakery", quantity: 35 },
      { category: "Cooked Meals", quantity: 50 },
      { category: "Dairy", quantity: 20 },
      { category: "Produce", quantity: 40 },
    ];
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        📈 {t("cards.category_chart")}
      </h2>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}