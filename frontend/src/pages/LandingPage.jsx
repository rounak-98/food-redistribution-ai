import { Link } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import {
  Building2,
  HeartHandshake,
  Bike,
  User,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const roles = [
    {
      title: "Food Business",
      badge: "Commercial Donor",
      desc: "Post surplus food, predict waste with AI, and generate Section 80G tax certificates.",
      icon: Building2,
      path: "/register/business",
      btnText: "Business Portal",
    },
    {
      title: "Verified NGO",
      badge: "Shelter Network",
      desc: "Claim fresh donations in real-time, matched automatically to your shelter capacity.",
      icon: HeartHandshake,
      path: "/register/ngo",
      btnText: "NGO Shelter Portal",
    },
    {
      title: "Volunteer Rider",
      badge: "Delivery Fleet",
      desc: "Accept nearby pickup tasks, follow optimized routes, and earn volunteer Karma XP.",
      icon: Bike,
      path: "/register/volunteer",
      btnText: "Rider Portal",
    },
    {
      title: "Individual Donor",
      badge: "Community Donor",
      desc: "Share surplus home-cooked meals with local community shelters and food drives.",
      icon: User,
      path: "/register/individual",
      btnText: "Individual Portal",
    },
  ];

  const highlights = [
    {
      icon: TrendingUp,
      title: "ML Surplus Forecasting",
      desc: "Predicts excess inventory and spoilage risks 7 days in advance.",
    },
    {
      icon: MapPin,
      title: "Live GIS Routing",
      desc: "Connects donors, volunteers, and shelters via shortest-distance paths.",
    },
    {
      icon: ShieldCheck,
      title: "2-Step OTP Handover",
      desc: "Cryptographic verification at pickup and drop-off ensures food safety.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50/50 to-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Cool Light Blue Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky-200/50 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[110px]"></div>
        <div className="absolute bottom-10 -right-40 w-[500px] h-[500px] bg-cyan-100/50 rounded-full blur-[110px]"></div>
      </div>

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-sky-100 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/25">
              F
            </span>
            <div className="leading-tight">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                FoodBridge <span className="text-blue-600">AI</span>
              </span>
              <span className="block text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                Redistribution Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector />

            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition shadow-xs"
            >
              Sign In
            </Link>

            <Link
              to="/select-account"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Driven Zero-Waste Food Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Surplus Food Redistribution,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600">
              Powered by AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Real-time matching connecting food businesses, recipient NGOs, and volunteer riders to cut food waste and feed local communities.
          </p>

          {/* Core Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/select-account"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-sky-300 font-bold text-sm px-8 py-3.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
            </Link>
          </div>

          {/* Clean 3-Metric Bar */}
          <div className="pt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm border border-sky-100 p-4 rounded-2xl shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-blue-600">50K+</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Meals Saved</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-sky-100 p-4 rounded-2xl shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-sky-600">150+</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Active Partners</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-sky-100 p-4 rounded-2xl shadow-sm">
              <p className="text-xl sm:text-2xl font-black text-cyan-600">99.2%</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Safe Handovers</p>
            </div>
          </div>
        </div>

        {/* ROLE PORTALS */}
        <section className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Select Your Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose your stakeholder category to access your dedicated dashboard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {roles.map((r) => {
              const IconComp = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white border border-sky-100 hover:border-blue-400 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                      {r.desc}
                    </p>
                  </div>

                  <Link
                    to={r.path}
                    className="mt-5 w-full bg-sky-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 border border-sky-100 hover:border-transparent"
                  >
                    <span>{r.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3 CORE PILLARS */}
        <section className="mt-14 sm:mt-18 max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className="bg-white/80 backdrop-blur-sm border border-sky-100 p-5 rounded-2xl flex items-start gap-3.5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0 flex items-center justify-center border border-blue-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="mt-16 text-center max-w-xl mx-auto bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/20">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Ready to Redistribute Surplus Food?
          </h3>
          <p className="text-xs text-blue-100 mt-2">
            Join restaurants, shelters, and riders reducing waste across the city.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              to="/select-account"
              className="bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/login"
              className="bg-blue-700/60 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl border border-blue-400/30 transition"
            >
              Portal Login
            </Link>
          </div>
        </section>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="relative z-10 border-t border-sky-100 py-6 px-4 text-center text-xs text-slate-400 bg-white/50">
        <p>© 2026 FoodBridge AI. All rights reserved.</p>
      </footer>
    </div>
  );
}