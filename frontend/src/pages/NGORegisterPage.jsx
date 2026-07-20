import NGOForm from "../components/forms/NGOForm";

export default function NGORegisterPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Register Your NGO
          </h1>

          <p className="text-gray-600 mt-3">
            Join FoodBridge AI to connect with food donors, receive surplus food,
            and help reduce food waste in your community.
          </p>
        </div>

        <NGOForm />

      </div>
    </div>
  );
}