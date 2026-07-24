export default function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");

  const role = user?.role?.toLowerCase();

  let accountName = user?.name || "User";
  let accountType = "Business Account";

  if (role === "ngo") {
    accountName = profile?.ngo_name || user?.name || "NGO Partner";
    accountType = "Registered NGO";
  } else if (role === "individual") {
    accountName = profile?.full_name || user?.name || "Individual Donor";
    accountType = "Household Food Donor";
  } else if (role === "volunteer") {
    accountName = profile?.full_name || user?.name || "Transport Rider";
    accountType = "Logistics Volunteer";
  } else if (role === "admin") {
    accountName = user?.name || "System Admin";
    accountType = "Super Admin Console";
  } else if (role === "business") {
    accountName = profile?.business_name || user?.name || "Business Partner";
    accountType = "Food Business Donor";
  }

  return (
    <header className="sticky top-0 z-20 bg-white shadow px-8 py-5 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          FoodBridge AI Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back, <span className="font-bold text-gray-800">{accountName}</span> 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-gray-900">{accountName}</p>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{accountType}</p>
        </div>

        <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow">
          {accountName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}