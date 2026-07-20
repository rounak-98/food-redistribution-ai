export default function Topbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const business = JSON.parse(localStorage.getItem("profile"));
  const accountName =
    user?.role === "ngo"
      ? business?.ngo_name
      : business?.business_name;

  const accountType =
    user?.role === "ngo"
      ? "NGO Account"
      : "Business Account";
  return (
    <header className="sticky top-0 z-20 bg-white shadow px-8 py-5 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          FoodBridge AI Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back, {accountName || "User"}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-semibold">
            {user?.name}
          </p>

          <p className="text-sm text-gray-500">
            {accountType}
          </p>

        </div>

        <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

      </div>

    </header>
  );
}