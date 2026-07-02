import { Link } from "react-router-dom";
import { Building2, Handshake, Leaf, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>

            <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
              FoodBridge <span className="text-green-600">AI</span>
            </h1>

            <p className="text-xl text-gray-600 mt-6 leading-8">
              AI Powered Food Redistribution Platform connecting
              Food Businesses, NGOs and Communities to reduce food waste.
            </p>

            <div className="flex gap-5 mt-10">

              <Link
                to="/select-account"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                Get Started
                <ArrowRight size={20}/>
              </Link>

              <Link
                to="/login"
                className="border border-green-600 text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
              >
                Login
              </Link>

            </div>

          </div>

          <div className="bg-green-100 rounded-3xl p-12">

            <div className="space-y-8">

              <div className="flex items-center gap-4">
                <Building2 className="text-green-700" size={40}/>
                <div>
                  <h3 className="font-bold text-xl">
                    Food Businesses
                  </h3>
                  <p>Restaurants • Hotels • Bakeries • Supermarkets</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Handshake className="text-green-700" size={40}/>
                <div>
                  <h3 className="font-bold text-xl">
                    NGOs
                  </h3>
                  <p>Food Banks • Community Kitchens</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Leaf className="text-green-700" size={40}/>
                <div>
                  <h3 className="font-bold text-xl">
                    Sustainable Future
                  </h3>
                  <p>Reduce Waste. Feed Communities.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}