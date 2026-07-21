import { useNavigate, useParams } from "react-router-dom";
import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";
import { useEffect, useState } from "react";
import { getDonationDetails, acceptDonation } from "../services/ngoService";
export default function DonationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [donation, setDonation] = useState(null);

  const fetchDonation = async () => {

    try {

      const data = await getDonationDetails(id);

      console.log("Donation Details:", data);

      setDonation(data);

    } catch (error) {

      console.error("Error fetching donation:", error);

    }

  };

  const handleAcceptDonation = async () => {
    try {
      await acceptDonation(id);

      alert("Donation accepted successfully!");

      navigate("/ngo/donations", { replace: true });
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);
      console.log("Headers:", error.response?.headers);
      alert("Failed to accept donation.");
    }
  };

  useEffect(() => {
    fetchDonation();
  }, []);

  const demodonation = {
    food: "Rice",
    donor: "ABC Restaurant",
    category: "Cooked Food",
    quantity: "20 kg",
    expiry: "Today",
    pickupTime: "3:00 PM - 5:00 PM",
    address: "MG Road, Pune",
    contact: "Rahul Sharma",
    phone: "+91 9876543210",
    instructions: "Pickup from the back entrance.",
  };
  if (!donation) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }
  return (
    <NGODashboardLayout>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          🍱 Donation Details
        </h1>

        <p className="text-gray-600 mb-8">
          Review donation details before accepting.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">Food Name</p>
              <h3 className="font-semibold text-lg">{donation.food_name}</h3>
            </div>

            <div>
              <p className="text-gray-500">Donor</p>
              <h3 className="font-semibold text-lg">{donation.business_name}</h3>
            </div>

            <div>
              <p className="text-gray-500">Category</p>
              <h3>{donation.food_category}</h3>
            </div>

            <div>
              <p className="text-gray-500">Quantity</p>
              <h3>{donation.quantity}</h3>
            </div>

            <div>
              <p className="text-gray-500">Expiry</p>
              <h3 className="text-orange-600">{donation.expiry_date}</h3>
            </div>

            <div>
              <p className="text-gray-500">Pickup Time</p>
              <h3>{donation.pickup_time}</h3>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-500">Pickup Address</p>
              <h3>{donation.pickup_address}</h3>
            </div>

            <div>
              <p className="text-gray-500">Contact Person</p>
              <h3>{donation.contact_person}</h3>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <h3>{donation.phone}</h3>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-500">Instructions</p>
              <h3>{donation.special_instructions}</h3>
            </div>

          </div>

          <div className="flex gap-4 mt-10">

            <button
              onClick={handleAcceptDonation}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Accept Donation
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg"
            >
              Back
            </button>

          </div>

        </div>

      </div>
    </NGODashboardLayout>
  );
}