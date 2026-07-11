import DonationForm from "../components/forms/DonationForm";

export default function AddDonationPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold">
          Add Food Donation
        </h1>

        <p className="text-gray-600 mt-3 mb-8">
          Register surplus food for NGO pickup.
        </p>

        <DonationForm />

      </div>
    </div>
  );
}