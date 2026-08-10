import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import {
  FaBuilding,
  FaHandshake,
  FaMotorcycle,
  FaHeart,
  FaShieldAlt,
  FaChartLine,
  FaMapMarkedAlt,
  FaLock,
  FaFileInvoiceDollar,
  FaGlobe,
  FaWifi,
  FaArrowRight,
  FaCheckCircle,
  FaLeaf,
  FaBoxes,
  FaMagic,
} from "react-icons/fa";

export default function LandingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("business");

  const rolesData = {
    business: {
      title: "For Food Businesses & Restaurants",
      subtitle: "Automate surplus food management, cut disposal costs & earn ESG tax credits",
      icon: <FaBuilding className="text-3xl text-blue-500" />,
      badge: "Commercial Donors",
      color: "from-blue-600 to-indigo-600",
      features: [
        "Predict 7-day excess inventory & spoilage risks with ML forecasting",
        "1-Click surplus food donation listing with automated portion calculation",
        "Instant Section 80G tax exemption & corporate ESG impact certificate generation",
        "Real-time dispatch tracking as volunteer riders pick up donations",
      ],
      stats: { primary: "100% Tax Compliant", secondary: "Zero Food Waste" },
      action: "Register Business",
      path: "/register/business",
    },
    ngo: {
      title: "For NGOs, Shelters & Food Banks",
      subtitle: "Receive free, fresh food donations matched automatically to your shelter capacity",
      icon: <FaHandshake className="text-3xl text-emerald-500" />,
      badge: "Recipient Network",
      color: "from-emerald-600 to-teal-600",
      features: [
        "Real-time push notifications when nearby commercial donors post fresh food",
        "Instant 1-click donation claiming with automated distance-based priority",
        "2-Step OTP cryptographic handover to verify food safety and delivery",
        "Complete digital inventory ledger and beneficiary distribution history",
      ],
      stats: { primary: "Free Food Supply", secondary: "Verified Quality" },
      action: "Register NGO Shelter",
      path: "/register/ngo",
    },
    volunteer: {
      title: "For Transport Riders & Volunteers",
      subtitle: "Earn Karma XP points & badges by completing zero-emission food deliveries",
      icon: <FaMotorcycle className="text-3xl text-amber-500" />,
      badge: "Logistics Fleet",
      color: "from-amber-500 to-orange-600",
      features: [
        "Live GIS route optimization connecting nearby donors directly to shelters",
        "Flexible Online/Offline status toggle to accept delivery tasks anytime",
        "4-Digit Donor & NGO OTP verification ensuring seamless handovers",
        "Gamified Karma points, distance milestones, and volunteer achievement badges",
      ],
      stats: { primary: "Gamified Rewards", secondary: "Optimized Routes" },
      action: "Become a Rider",
      path: "/register/volunteer",
    },
    individual: {
      title: "For Individual Donors & Households",
      subtitle: "Share excess home-cooked meals & party surplus with local food banks",
      icon: <FaHeart className="text-3xl text-purple-500" />,
      badge: "Community Donors",
      color: "from-purple-600 to-pink-600",
      features: [
        "Post excess home food, party leftovers, or packaged groceries in seconds",
        "Discover verified nearby NGO centers and community food drop-off points",
        "Track personal CO₂ offset, meals contributed, and unlock zero-waste badges",
        "Help build a compassionate, hunger-free neighborhood",
      ],
      stats: { primary: "Community First", secondary: "Zero Home Waste" },
      action: "Post Home Surplus",
      path: "/register/individual",
    },
    admin: {
      title: "For Super Administrators",
      subtitle: "Comprehensive platform oversight across users, master ledgers & transport dispatches",
      icon: <FaShieldAlt className="text-3xl text-indigo-400" />,
      badge: "Platform Governance",
      color: "from-indigo-900 to-slate-900",
      features: [
        "System-wide user role management across Business, NGO, Household, and Riders",
        "Master audit ledger tracking every kilogram of food saved across regions",
        "Live network-wide GIS map showing active donor nodes and volunteer riders",
        "Advanced visual analytics for environmental offset and redistribution trends",
      ],
      stats: { primary: "Full Governance", secondary: "Live Monitoring" },
      action: "Admin Portal Login",
      path: "/login",
    },
  };

  const currentRole = rolesData[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Ambient Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-emerald-500/20">
            🌱
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              FoodBridge <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">AI</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              Zero-Waste Redistribution & Logistics
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition">Features</a>
          <a href="#roles" className="hover:text-emerald-400 transition">Portals</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a>
          <a href="#impact" className="hover:text-emerald-400 transition">Impact</a>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />

          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-extrabold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 transition bg-slate-900/60"
          >
            Log In
          </Link>

          <Link
            to="/select-account"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition transform hover:scale-105 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-extrabold text-emerald-400 shadow-xl backdrop-blur-md animate-pulse">
            <FaMagic className="text-emerald-400 text-xs" />
            <span>AI-Powered Zero-Waste Food Redistribution & Logistics</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
            Eliminate Food Waste. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Feed Communities with AI.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            FoodBridge AI seamlessly connects commercial food businesses, households, recipient NGOs, and volunteer transport riders in real-time. Powered by ML surplus forecasting, live GIS logistics, and 2-step OTP cryptographic verification.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/select-account"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🚀 Launch Live Platform</span>
              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl transition flex items-center justify-center gap-2"
            >
              <span>🔑 Sign In to Portal</span>
            </Link>
          </div>

          {/* Real-time Metrics Pill Ticker */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">50,000+</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Meals Saved</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">12,500 kg</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">CO₂ Offset</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">150+</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Donors</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">98.4%</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Dispatch Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM FEATURES GRID */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
            Designed for Impact & Scalability
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Built with modern technology to guarantee zero food waste, full transparency, and rapid delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-bold text-white">🔮 ML Surplus Forecasting</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Scikit-Learn ML models analyze historical inventory patterns to predict 7-day excess volume and calculate spoilage risk levels in advance.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <FaMapMarkedAlt />
            </div>
            <h3 className="text-xl font-bold text-white">📍 Smart GIS Route Optimization</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Interactive Leaflet GIS mapping plots food donors, recipient shelters, and active volunteer riders to optimize shortest-path dispatches.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <FaLock />
            </div>
            <h3 className="text-xl font-bold text-white">🔐 2-Step OTP Verification</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Cryptographic 4-digit OTP codes required at donor pickup and NGO drop-off to eliminate delivery fraud and enforce food quality standards.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <FaFileInvoiceDollar />
            </div>
            <h3 className="text-xl font-bold text-white">📜 ESG & Section 80G Tax Credits</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Automated impact certificate generator creates official Section 80G tax exemption reports for corporate ESG sustainability compliance.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <FaGlobe />
            </div>
            <h3 className="text-xl font-bold text-white">🌐 100% Multilingual Support</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Native i18n support in English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ), and Tamil (தமிழ்) across every dashboard, menu, and modal.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <FaWifi />
            </div>
            <h3 className="text-xl font-bold text-white">📱 PWA Offline Support</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Progressive Web App with Workbox Service Worker precaching allows instant offline loading and home screen app installation.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROLE SHOWCASE TABS */}
      <section id="roles" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/20">
            Multi-Stakeholder Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
            Tailored Experiences for Every Role
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Select a stakeholder role below to explore dedicated portal capabilities.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {[
            { id: "business", label: "Commercial Donors", icon: <FaBuilding /> },
            { id: "ngo", label: "NGO Shelters", icon: <FaHandshake /> },
            { id: "volunteer", label: "Transport Riders", icon: <FaMotorcycle /> },
            { id: "individual", label: "Household Donors", icon: <FaHeart /> },
            { id: "admin", label: "Super Admin", icon: <FaShieldAlt /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Showcase Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                {currentRole.icon}
                <span>{currentRole.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {currentRole.title}
              </h3>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {currentRole.subtitle}
              </p>

              <div className="space-y-3 pt-2">
                {currentRole.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                    <FaCheckCircle className="text-emerald-400 text-base shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to={currentRole.path}
                  className={`bg-gradient-to-r ${currentRole.color} text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2`}
                >
                  <span>{currentRole.action}</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>

            {/* Visual Callout Box */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Metric Highlights</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-2xl font-extrabold text-emerald-400">{currentRole.stats.primary}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Primary Objective</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-teal-400">{currentRole.stats.secondary}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Standard Standard</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-200">Supported Devices & Compatibility:</p>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-400">
                  <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">💻 Desktop Web</span>
                  <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">📱 Mobile PWA</span>
                  <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">⚡ Offline Mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-amber-500/10 text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
            How FoodBridge AI Operates
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            A seamless 4-step process from surplus discovery to NGO handover.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "01", icon: <FaBoxes />, title: "Surplus Food Post", desc: "Commercial business or household lists surplus food with quantity and expiry details." },
            { step: "02", icon: <FaChartLine />, title: "AI Match & Dispatch", desc: "ML algorithms match nearest verified NGO shelters and dispatch nearby volunteer riders." },
            { step: "03", icon: <FaLock />, title: "2-Step OTP Handover", desc: "Rider verifies 4-digit pickup OTP at donor site and 4-digit drop-off OTP at NGO shelter." },
            { step: "04", icon: <FaLeaf />, title: "ESG Tax Credits", desc: "Donation is logged into master ledger and Section 80G tax exemption certificates are issued." },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3 relative group hover:border-emerald-500/40 transition">
              <span className="text-3xl font-extrabold text-slate-700 group-hover:text-emerald-400 transition">{item.step}</span>
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center text-lg">
                {item.icon}
              </div>
              <h4 className="text-lg font-bold text-white">{item.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 sm:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Join the Zero-Waste Movement?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              Start redistributing surplus food, earning ESG tax credits, and feeding local communities today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/select-account"
              className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-lg transition text-center whitespace-nowrap"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="bg-emerald-800/60 hover:bg-emerald-800 text-white font-extrabold text-sm px-8 py-4 rounded-2xl border border-emerald-400 transition text-center whitespace-nowrap"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-lg font-extrabold text-white">FoodBridge AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Real-time AI-powered food redistribution & zero-waste logistics platform connecting businesses, shelters, and volunteers.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-extrabold text-white uppercase tracking-wider text-[11px]">Portals</p>
            <ul className="space-y-2 font-medium">
              <li><Link to="/register/business" className="hover:text-emerald-400">Business Donor</Link></li>
              <li><Link to="/register/ngo" className="hover:text-emerald-400">NGO Shelters</Link></li>
              <li><Link to="/register/volunteer" className="hover:text-emerald-400">Volunteer Rider</Link></li>
              <li><Link to="/register/individual" className="hover:text-emerald-400">Household Donor</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-extrabold text-white uppercase tracking-wider text-[11px]">Platform</p>
            <ul className="space-y-2 font-medium">
              <li><Link to="/login" className="hover:text-emerald-400">System Login</Link></li>
              <li><a href="#features" className="hover:text-emerald-400">AI Forecasting</a></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400">GIS Logistics</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-extrabold text-white uppercase tracking-wider text-[11px]">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">FastAPI</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">React</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">Scikit-Learn</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">Leaflet</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">Workbox PWA</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} FoodBridge AI. All Rights Reserved. Building zero-waste sustainable communities.</p>
          <p className="text-[11px] text-slate-500">FastAPI • React • Scikit-Learn • OpenStreetMap • Workbox PWA</p>
        </div>
      </footer>
    </div>
  );
}