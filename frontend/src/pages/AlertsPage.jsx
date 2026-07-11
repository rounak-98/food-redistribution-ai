import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";

export default function AlertsPage() {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const businessId = storedUser?.business?.id;

    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        loadInventory();
    }, []);

    async function loadInventory() {
        try {
            const data = await getInventory(businessId);
            setInventory(data);
        } catch (err) {
            console.log(err);
        }
    }

    const expired = inventory.filter(
        item => item.status === "Expired"
    );

    const expiring = inventory.filter(
        item => item.status === "Expiring Soon"
    );

    return (

        <DashboardLayout>

            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold mb-2">
                    🔔 Alerts
                </h1>

                <p className="text-gray-500 mb-8">
                    Monitor critical inventory notifications.
                </p>

                {/* Critical Alerts */}

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">

                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        🔴 Critical Alerts
                    </h2>

                    {expired.length === 0 ? (

                        <p>No expired products.</p>

                    ) : (

                        expired.map(item => (

                            <p
                                key={item.id}
                                className="mb-2"
                            >
                                <strong>{item.product_name}</strong> has expired.
                            </p>

                        ))

                    )}

                </div>

                {/* Warning */}

                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">

                    <h2 className="text-2xl font-bold text-orange-500 mb-4">
                        🟠 Warning Alerts
                    </h2>

                    {expiring.length === 0 ? (

                        <p>No products expiring soon.</p>

                    ) : (

                        expiring.map(item => (

                            <p
                                key={item.id}
                                className="mb-2"
                            >
                                <strong>{item.product_name}</strong> expires soon.
                            </p>

                        ))

                    )}

                </div>

                {/* System */}

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                        ✅ System Status
                    </h2>

                    <p>Inventory synchronized.</p>

                    <p>AI recommendations updated.</p>

                    <p>Dashboard connected successfully.</p>

                </div>

            </div>

        </DashboardLayout>

    );

}