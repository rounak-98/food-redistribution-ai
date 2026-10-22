import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";
import api from "../services/api";
import {
  Building2,
  HeartHandshake,
  Bike,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeQuickRole, setActiveQuickRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [seedStatus, setSeedStatus] = useState(null);

  const demoAccounts = [
    {
      role: "business",
      title: "Business Donor",
      org: "Grand Heritage Kitchen",
      email: "restaurant@foodbridge.com",
      password: "biz123",
      icon: Building2,
      badge: "Restaurant",
      borderClass: "hover:border-emerald-500 hover:bg-emerald-50/50",
      badgeClass: "bg-emerald-100 text-emerald-800",
      iconBg: "bg-emerald-100 text-emerald-600",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      role: "ngo",
      title: "Verified NGO",
      org: "Asha Food Relief Trust",
      email: "ngo@foodbridge.com",
      password: "ngo123",
      icon: HeartHandshake,
      badge: "Charity",
      borderClass: "hover:border-amber-500 hover:bg-amber-50/50",
      badgeClass: "bg-amber-100 text-amber-800",
      iconBg: "bg-amber-100 text-amber-600",
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      role: "volunteer",
      title: "Volunteer Rider",
      org: "Rahul Deshmukh (Bike)",
      email: "rider@foodbridge.com",
      password: "rider123",
      icon: Bike,
      badge: "Delivery",
      borderClass: "hover:border-blue-500 hover:bg-blue-50/50",
      badgeClass: "bg-blue-100 text-blue-800",
      iconBg: "bg-blue-100 text-blue-600",
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      role: "individual",
      title: "Individual Donor",
      org: "Amit Verma",
      email: "individual@foodbridge.com",
      password: "ind123",
      icon: User,
      badge: "Resident",
      borderClass: "hover:border-purple-500 hover:bg-purple-50/50",
      badgeClass: "bg-purple-100 text-purple-800",
      iconBg: "bg-purple-100 text-purple-600",
      btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      role: "admin",
      title: "Super Admin",
      org: "System Operations",
      email: "admin@foodbridge.com",
      password: "admin123",
      icon: ShieldCheck,
      badge: "Admin",
      borderClass: "hover:border-rose-500 hover:bg-rose-50/50",
      badgeClass: "bg-rose-100 text-rose-800",
      iconBg: "bg-rose-100 text-rose-600",
      btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
    },
  ];

  const executeLogin = async (loginEmail, loginPassword, roleKey = null) => {
    setLoading(true);
    setActiveQuickRole(roleKey);
    setErrorMessage("");

    try {
      const response = await loginUser({
        email: loginEmail,
        password: loginPassword,
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
      if (!navigator.onLine || err.message === "Network Error" || err.code === "ERR_NETWORK") {
        setErrorMessage(
          "⚠️ You are currently offline. Please connect to the internet to log in to your account."
        );
      } else {
        setErrorMessage(err.response?.data?.detail || err.message || "Login Failed. Please check credentials.");
      }
    } finally {
      setLoading(false);
      setActiveQuickRole(null);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    executeLogin(acc.email, acc.password, acc.role);
  };

  const handleReseedAccounts = async () => {
    try {
      setSeedStatus("Verifying & seeding accounts...");
      await api.post("/api/auth/seed-demo-accounts");
      setSeedStatus("✅ All 5 core role accounts are active and ready!");
      setTimeout(() => setSeedStatus(null), 4000);
    } catch (err) {
      setSeedStatus("⚠️ Failed to reseed accounts: " + (err.response?.data?.detail || err.message));
      setTimeout(() => setSeedStatus(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Traditional Login Form */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                F
              </span>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-gray-900">
                  FoodBridge <span className="text-emerald-600">AI</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                  Redistribution Network
                </span>
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 mb-6 text-sm">
              Log in to your account or pick an instant role demo on the right.
            </p>

            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl leading-relaxed shadow-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password *
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && !activeQuickRole ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            Don't have an account yet?{" "}
            <Link
              to="/select-account"
              className="text-emerald-600 font-bold hover:underline"
            >
              Create New Account
            </Link>
          </div>
        </div>

        {/* Right Column: 1-Click Demo Accounts */}
        <div className="lg:col-span-6 bg-slate-50 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                  Instant 1-Click Role Login
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Saved Accounts
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Click any account below to instantly authenticate into its custom dashboard with verified data.
            </p>

            {seedStatus && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                {seedStatus}
              </div>
            )}

            <div className="space-y-2.5">
              {demoAccounts.map((acc) => {
                const IconComponent = acc.icon;
                const isCurrentActive = loading && activeQuickRole === acc.role;

                return (
                  <div
                    key={acc.role}
                    onClick={() => !loading && handleQuickLogin(acc)}
                    className={`group relative p-3 bg-white border border-gray-200 rounded-2xl cursor-pointer transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-between gap-3 ${acc.borderClass} ${
                      isCurrentActive ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${acc.iconBg}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-700 transition">
                            {acc.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${acc.badgeClass}`}
                          >
                            {acc.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate font-medium">
                          {acc.org}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">
                          {acc.email} • Pass: {acc.password}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(acc);
                      }}
                      className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm ${acc.btnClass} disabled:opacity-50`}
                    >
                      {isCurrentActive ? (
                        <span>Connecting...</span>
                      ) : (
                        <>
                          <span>Login</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              All 5 roles active in MySQL
            </span>
            <button
              type="button"
              onClick={handleReseedAccounts}
              className="text-gray-500 hover:text-emerald-700 font-semibold underline transition cursor-pointer"
            >
              Verify / Repair Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}