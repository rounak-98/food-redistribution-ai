import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { useEffect, useState } from "react";
import { getAcceptedDonations } from "../services/donationService";
export default function AcceptedDonationsPage() {

  const [acceptedDonations, setAcceptedDonations] = useState([]);

  useEffect(() => {
    loadAcceptedDonations();
  }, []);

  const loadAcceptedDonations = async () => {
    try {
      const data = await getAcceptedDonations();
      setAcceptedDonations(data);
    } catch (error) {
      console.error("Failed to load accepted donations:", error);
    }
  };

  return (
    <NGODashboardLayout>

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold">
          ✅ Accepted Donations
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Track all donations accepted by your NGO.
        </p>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="text-left p-4">Food</th>
                <th className="text-left p-4">Donor</th>
                <th className="text-left p-4">Quantity</th>
                <th className="text-left p-4">Pickup Date</th>
                <th className="text-left p-4">Status</th>

              </tr>

            </thead>

            <tbody>

              {acceptedDonations.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    🍱 {item.food_name}
                  </td>

                  <td className="p-4">
                    {item.business?.business_name || "Business"}
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4">
                    {item.pickup_time}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${item.status === "Accepted"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "Pickup Scheduled"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </NGODashboardLayout>
  );
}