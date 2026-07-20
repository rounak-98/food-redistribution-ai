import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { useNavigate } from "react-router-dom";
import { getAvailableDonations } from "../services/ngoService";
import { useState, useEffect } from "react";

export default function AvailableDonationsPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const fetchDonations = async () => {

    try {

      const data = await getAvailableDonations();

      console.log("Donations:", data);

      setDonations(data);

    } catch (error) {

      console.error("Error fetching donations:", error);

    }

  };
  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <NGODashboardLayout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold">
          🍱 Available Donations
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Browse food donations available for pickup.
        </p>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="text-left p-4">Food</th>

                <th className="text-left p-4">Donor</th>

                <th className="text-left p-4">Quantity</th>

                <th className="text-left p-4">Expiry</th>

                <th className="text-left p-4">Distance</th>

                <th className="text-left p-4">Status</th>

                <th className="text-center p-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {donations.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    🍱 {item.food_name}
                  </td>

                  <td className="p-4">
                    {item.contact_person}
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4 text-orange-600">
                    {item.expiry_date}
                  </td>

                  <td className="p-4">
                    {item.distance}
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">

                    <button
                        onClick={() => 
                          navigate(`/ngo/donation-details/${item.id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        View
                    </button>

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