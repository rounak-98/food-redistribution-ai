import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      // Clear old profile & token
      localStorage.removeItem("profile");
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.business) {
        localStorage.setItem("profile", JSON.stringify(response.business));
      }
      if (response.ngo) {
        localStorage.setItem("profile", JSON.stringify(response.ngo));
      }
      if (response.individual) {
        localStorage.setItem("profile", JSON.stringify(response.individual));
      }
      if (response.volunteer) {
        localStorage.setItem("profile", JSON.stringify(response.volunteer));
      }

      const role = response.user.role?.toLowerCase();
      if (role === "business") {
        navigate("/dashboard/business");
      } else if (role === "ngo") {
        navigate("/dashboard/ngo");
      } else if (role === "individual") {
        navigate("/dashboard/individual");
      } else if (role === "volunteer") {
        navigate("/dashboard/volunteer");
      } else if (role === "admin") {
        navigate("/dashboard/admin");
      }
    } catch (err) {
      alert(err.response?.data?.detail || err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mb-8 text-sm">
          Login to your FoodBridge AI account.
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition shadow text-sm"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link to="/select-account" className="text-emerald-700 font-bold hover:underline">
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}