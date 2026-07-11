import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {

        const response = await loginUser({
            email,
            password,
        });

        localStorage.setItem(
            "user",
            JSON.stringify(response)
        );

        navigate("/dashboard/business");

    } catch (err) {

        alert(
            err.response?.data?.detail ||
            "Login Failed"
        );

    }
}
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold mb-3">
          Welcome Back
        </h1>

        <p className="text-gray-600 mb-8">
          Login to your FoodBridge AI account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-xl p-4"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-4"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold"
          >
            Login
          </button>

        </form>

        <div className="mt-8 text-center">

          <Link
            to="/select-account"
            className="text-green-700 font-semibold"
          >
            Create New Account
          </Link>

        </div>

      </div>

    </div>
  );
}