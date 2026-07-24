import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function CategoryBarChart({ inventory = [] }) {
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const categoryMap = {};

  safeInventory.forEach((item) => {
    const category =
      item?.food_category ||
      item?.category ||
      "Others";

    categoryMap[category] =
      (categoryMap[category] || 0) + 1;
  });

  const labels = Object.keys(categoryMap).length > 0 ? Object.keys(categoryMap) : ["Cooked Meal", "Bakery", "Produce"];
  const values = Object.keys(categoryMap).length > 0 ? Object.values(categoryMap) : [0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        label: "Food Items",
        data: values,
        backgroundColor: "#16a34a",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
      <h2 className="text-xl font-bold mb-4">
        Category Distribution
      </h2>

      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}