import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InventoryPieChart({ inventory = [] }) {
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const fresh = safeInventory.filter((i) => i?.status === "Fresh").length;
  const expiring = safeInventory.filter((i) => i?.status === "Expiring Soon").length;
  const expired = safeInventory.filter((i) => i?.status === "Expired").length;

  const data = {
    labels: ["Fresh", "Expiring", "Expired"],
    datasets: [
      {
        data: [fresh, expiring, expired],
        backgroundColor: [
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
      <h2 className="text-xl font-bold mb-4">
        Inventory Status
      </h2>

      <div className="h-[300px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}