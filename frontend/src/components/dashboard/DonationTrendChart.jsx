import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function DonationTrendChart({ donations = [] }) {
  const data = {
    labels: donations.map((_, index) => `#${index + 1}`),
    datasets: [
      {
        label: "Donation Quantity",
        data: donations.map((item) => Number(item.quantity) || 0),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
      <h2 className="text-xl font-bold mb-4">
        Donation Trend
      </h2>

      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}