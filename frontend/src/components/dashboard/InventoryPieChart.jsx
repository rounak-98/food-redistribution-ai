import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function InventoryPieChart({ inventory = [] }) {
  const { t } = useTranslation();
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const fresh = safeInventory.filter((item) => item?.status === "Fresh").length;
  const expiring = safeInventory.filter((item) => item?.status === "Expiring Soon").length;
  const expired = safeInventory.filter((item) => item?.status === "Expired").length;
  const donated = safeInventory.filter((item) => item?.status === "Donated").length;

  const data = [
    { name: "Fresh", value: fresh || (safeInventory.length === 0 ? 12 : 0) },
    { name: "Expiring Soon", value: expiring || (safeInventory.length === 0 ? 4 : 0) },
    { name: "Expired", value: expired || (safeInventory.length === 0 ? 1 : 0) },
    { name: "Donated", value: donated || (safeInventory.length === 0 ? 5 : 0) },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        📊 {t("cards.inventory_distribution")}
      </h2>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}