import { useEffect, useState } from "react";
import { getBusinessDonations } from "../services/donationService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function DonationHistoryPage() {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const businessId = storedUser?.business?.id;
    
    const [donations, setDonations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDonations();
    }, []);

    async function loadDonations() {
        try {
            const data = await getBusinessDonations(businessId);
            setDonations(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <DashboardLayout>

        <div className="max-w-7xl mx-auto">

            <h1 className="text-4xl font-bold">
                🍱 Donation Management
            </h1>

            <p className="text-gray-500 mt-2 mb-6">
                Register, monitor and manage all food donations.
            </p>

            <button
                onClick={() => navigate("/donations/add")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold mb-8"
            >
                ➕ Add Donation
            </button>

            <h2 className="text-2xl font-bold mb-6">
                Recent Donations
            </h2>

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <table className="w-full">

                    <thead className="border-b">

                        <tr>

                            <th className="text-left p-4">Food</th>

                            <th className="text-left p-4">Category</th>

                            <th className="text-left p-4">Quantity</th>

                            <th className="text-left p-4">Expiry</th>

                            <th className="text-left p-4">Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {donations.map((donation) => (

                            <tr
                                key={donation.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="p-4">
                                    {donation.food_name}
                                </td>

                                <td className="p-4">
                                    {donation.food_category}
                                </td>

                                <td className="p-4">
                                    {donation.quantity}{donation.unit}
                                </td>

                                <td className="p-4">
                                    {donation.expiry_date}
                                </td>

                                <td className="p-4">

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                        {donation.status}

                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

        </DashboardLayout>
    );

}