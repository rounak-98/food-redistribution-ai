import { Link, useNavigate } from "react-router-dom";

export default function BusinessForm() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // TODO: Replace with backend API call later
    navigate("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Business Information */}
      <div>
        <h2 className="text-2xl font-semibold mb-5">
          Business Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Business Name"
            className="border rounded-xl p-4"
            required
          />

          <select
            className="border rounded-xl p-4"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select Business Type
            </option>
            <option>Restaurant</option>
            <option>Hotel</option>
            <option>Bakery</option>
            <option>Supermarket</option>
            <option>Cloud Kitchen</option>
            <option>Catering Service</option>
            <option>Cafe</option>
            <option>Sweet Shop</option>
            <option>Hostel / Mess</option>
            <option>College Canteen</option>
          </select>

          <input
            type="text"
            placeholder="Owner / Manager Name"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="text"
            placeholder="FSSAI License Number"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="text"
            placeholder="GST Number (Optional)"
            className="border rounded-xl p-4"
          />

        </div>
      </div>

      {/* Contact Details */}
      <div>
        <h2 className="text-2xl font-semibold mb-5">
          Contact Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="email"
            placeholder="Email Address"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border rounded-xl p-4 md:col-span-2"
            required
          />

          <input
            type="text"
            placeholder="City"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="text"
            placeholder="State"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="text"
            placeholder="Pincode"
            className="border rounded-xl p-4"
            required
          />

        </div>
      </div>

      {/* Account */}
      <div>
        <h2 className="text-2xl font-semibold mb-5">
          Account
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="password"
            placeholder="Password"
            className="border rounded-xl p-4"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-xl p-4"
            required
          />

        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition"
        >
          Create Account
        </button>

        <Link
          to="/login"
          className="text-green-700 font-semibold hover:underline"
        >
          Already have an account? Login
        </Link>

      </div>

    </form>
  );
}