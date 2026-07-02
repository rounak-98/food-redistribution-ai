import BusinessForm from "../components/forms/BusinessForm";

export default function BusinessRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Register Your Food Business
          </h1>

          <p className="text-gray-600 mt-3">
            Join FoodBridge AI and start reducing food waste while helping your
            community.
          </p>
        </div>

        <BusinessForm />

      </div>
    </div>
  );
}