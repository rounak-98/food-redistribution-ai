import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getInventory } from "../services/inventoryService";
import { useNavigate } from "react-router-dom";
import { uploadInventoryCSV } from "../services/inventoryService";

export default function InventoryPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const businessId = storedUser?.business?.id;
    const [selectedFile, setSelectedFile] = useState(null);
    const [inventory, setInventory] = useState([]);
    const totalItems = inventory.length;

    const freshItems = inventory.filter(
      (item) => item.status === "Fresh"
    ).length;

    const expiringItems = inventory.filter(
      (item) => item.status === "Expiring Soon"
    ).length;

    const expiredItems = inventory.filter(
      (item) => item.status === "Expired"
    ).length;
    

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

        const result = await uploadInventoryCSV(
            businessId,
            file
        );

        alert(result.message);

        loadInventory();

    }

    catch(err){

        alert(
            err.response?.data?.detail ||
            "CSV upload failed."
        );

    }

};
  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto">

        {/* Page Heading */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Inventory
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your food inventory and prevent waste.
            </p>
          </div>

          <div className="flex gap-4">

            <button
              onClick={() => navigate("/inventory/add")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              + Add Item
            </button>

            <>
            <input
                type="file"
                accept=".csv"
                id="csvUpload"
                hidden
                onChange={handleCSVUpload}
            />

            <button
                onClick={() =>
                    document
                        .getElementById("csvUpload")
                        .click()
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
                Upload CSV
            </button>
            </>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold">
              Scan Barcode
            </button>

          </div>

        </div>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Total Items</p>
            <h2 className="text-4xl font-bold mt-2">{totalItems}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Fresh</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">{freshItems}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Expiring Soon</p>
            <h2 className="text-4xl font-bold text-orange-500 mt-2">{expiringItems}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Expired</p>
            <h2 className="text-4xl font-bold text-red-600 mt-2">{expiredItems}</h2>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <input
            placeholder="Search inventory..."
            className="border rounded-xl p-4 w-full"
          />

        </div>

        {/* Inventory Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Product</th>

                <th className="p-4 text-left">Category</th>

                <th className="p-4 text-left">Quantity</th>

                <th className="p-4 text-left">Expiry</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-left">Action</th>

              </tr>

            </thead>

            <tbody>

            {inventory.map((item) => (

            <tr
                key={item.id}
                className="border-b hover:bg-slate-50"
            >

                <td className="p-4">
                  {item.product_name}
                </td>

                <td>
                  {item.category}
                </td>

                <td>
                  {item.quantity} {item.unit}
                </td>

                <td>
                  {item.expiry_date}
                </td>

                <td>

                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold

                        ${
                            item.status === "Fresh"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Expiring Soon"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {item.status}
                    </span>

                </td>



                <td>

                  {item.status === "Expired" ? (

                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      Discard
                    </button>

                  ) : (

                    <button
                        onClick={() =>
                            navigate("/donations/add", {
                                state: {
                                    inventoryItem: item
                                }
                            })
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                        Donate
                    </button>

                  )}

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