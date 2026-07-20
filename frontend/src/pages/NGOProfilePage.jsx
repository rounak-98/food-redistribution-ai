import NGODashboardLayout from "../components/dashboard/NGODashboardLayout";

export default function NGOProfilePage() {
  return (
    <NGODashboardLayout>
      <h1 className="text-3xl font-bold">
        👤 NGO Profile
      </h1>

      <p className="text-gray-600 mt-2">
        View and update NGO information.
      </p>
    </NGODashboardLayout>
  );
}