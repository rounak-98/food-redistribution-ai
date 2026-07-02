import { Link } from "react-router-dom";
import { Building2, Handshake, User, Truck } from "lucide-react";

const roles = [
  {
    title: "Food Business",
    icon: Building2,
    description: "Restaurants, Hotels, Bakeries & Supermarkets",
    link: "/register/business",
  },
  {
    title: "NGO",
    icon: Handshake,
    description: "Food Banks & Community Kitchens",
    link: "/register/ngo",
  },
  {
    title: "Individual",
    icon: User,
    description: "Donate surplus food from home or events",
    link: "/register/individual",
  },
  {
    title: "Volunteer",
    icon: Truck,
    description: "Help transport donated food",
    link: "/register/volunteer",
  },
];

export default function SelectAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-center">
          Choose Your Account Type
        </h1>

        <p className="text-center text-gray-600 mt-4 text-lg">
          Select how you'd like to use FoodBridge AI
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <div
                key={role.title}
                className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
              >
                <Icon size={48} className="text-green-600 mb-6" />

                <h2 className="text-2xl font-bold">
                  {role.title}
                </h2>

                <p className="text-gray-600 mt-3 mb-8">
                  {role.description}
                </p>

                <Link
                  to={role.link}
                  className="block text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Continue
                </Link>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}