import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";

export default function NGOHistoryPage() {
  return (
    <NGODashboardLayout>
      <h1 className="text-3xl font-bold">
        📜 Donation History
      </h1>

      <p className="text-gray-600 mt-2">
        View completed food distribution records.
      </p>
    </NGODashboardLayout>
  );
}