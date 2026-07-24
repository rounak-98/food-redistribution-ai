import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
    getInventory,
    uploadInventoryCSV,
    deleteInventoryItem,
    autoDonateInventoryItem
} from "../services/inventoryService";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const businessId = storedUser?.business?.id;
    const [inventory, setInventory] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [autoDonatingId, setAutoDonatingId] = useState(null);

    const totalItems = inventory.length;
    const freshItems = inventory.filter((item) => item.status === "Fresh").length;
    const expiringItems = inventory.filter((item) => item.status === "Expiring Soon").length;
    const expiredItems = inventory.filter((item) => item.status === "Expired").length;

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

    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const result = await uploadInventoryCSV(businessId, file);
            alert(result.message);
            loadInventory();
        } catch (err) {
            alert(err.response?.data?.detail || "CSV upload failed.");
        }
    };

    const handleDiscard = async (itemId) => {
        const confirmDelete = window.confirm("Are you sure you want to discard this item?");
        if (!confirmDelete) return;

        try {
            const result = await deleteInventoryItem(itemId);
            alert(result.message);
            loadInventory();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to discard item.");
        }
    };

    const handleAutoDonate = async (itemId, productName) => {
        try {
            setAutoDonatingId(itemId);
            const result = await autoDonateInventoryItem(itemId);
            alert(result.message);
            loadInventory();
            navigate("/donations/history");
        } catch (err) {
            console.error("Auto donate failed:", err);
            alert(err.response?.data?.detail || "Failed to auto donate item.");
        } finally {
            setAutoDonatingId(null);
        }
    };

    const filteredInventory = inventory.filter(
        (item) =>
            item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📦 Surplus Food Inventory</h1>
                        <p className="text-gray-500 mt-1">
                            Track food batches, scan barcodes, and convert expiring stock into instant donations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => navigate("/inventory/add")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition"
                        >
                            + Add Product
                        </button>

                        <input
                            type="file"
                            accept=".csv"
                            id="csvUpload"
                            hidden
                            onChange={handleCSVUpload}
                        />

                        <button
                            onClick={() => document.getElementById("csvUpload").click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition"
                        >
                            📄 Upload CSV
                        </button>

                        <button
                            onClick={() => navigate("/inventory/scan")}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition"
                        >
                            📷 Scan Barcode
                        </button>
                    </div>
                </div>

                {/* Summary Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500">Total Products</p>
                        <h2 className="text-3xl font-extrabold text-gray-900 mt-2">{totalItems}</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500">Fresh Items</p>
                        <h2 className="text-3xl font-extrabold text-emerald-600 mt-2">{freshItems}</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500">Expiring Soon</p>
                        <h2 className="text-3xl font-extrabold text-amber-500 mt-2">{expiringItems}</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500">Expired Stock</p>
                        <h2 className="text-3xl font-extrabold text-rose-600 mt-2">{expiredItems}</h2>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
                    <input
                        type="text"
                        placeholder="🔍 Search product name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Quantity</th>
                                    <th className="p-4">Expiry Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-500">
                                            No inventory items found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4 font-bold text-gray-900">
                                                🍱 {item.product_name}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                                                    {item.category}
                                                </span>
                                            </td>

                                            <td className="p-4 font-semibold text-blue-600">
                                                {item.quantity} {item.unit || "pcs"}
                                            </td>

                                            <td className="p-4 text-gray-700 font-medium">
                                                ⏰ {item.expiry_date}
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        item.status === "Fresh"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : item.status === "Expiring Soon"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : item.status === "Donated"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-rose-100 text-rose-800"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                {item.status === "Expired" ? (
                                                    <button
                                                        onClick={() => handleDiscard(item.id)}
                                                        className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                                                    >
                                                        Discard
                                                    </button>
                                                ) : item.status === "Donated" ? (
                                                    <span className="text-xs text-blue-600 font-bold">✓ Listed Donation</span>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleAutoDonate(item.id, item.product_name)}
                                                            disabled={autoDonatingId === item.id}
                                                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                                                        >
                                                            {autoDonatingId === item.id ? "Donating..." : "⚡ Auto Donate"}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                navigate("/donations/add", {
                                                                    state: { inventoryItem: item },
                                                                })
                                                            }
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                                                        >
                                                            Custom Donate
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}