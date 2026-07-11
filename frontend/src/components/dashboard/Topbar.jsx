export default function Topbar() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="bg-white shadow px-8 py-5 flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          FoodBridge AI Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back, {storedUser?.business?.business_name}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-semibold">
            {storedUser?.user?.name}
          </p>

          <p className="text-sm text-gray-500">
            Business Account
          </p>

        </div>

        <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
          {storedUser?.user?.name?.charAt(0)}
        </div>

      </div>

    </header>
  );
}