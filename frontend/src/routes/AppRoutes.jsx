import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import SelectAccountPage from "../pages/SelectAccountPage";
import LoginPage from "../pages/LoginPage";

import BusinessRegisterPage from "../pages/BusinessRegisterPage";
import NGORegisterPage from "../pages/NGORegisterPage";
import IndividualRegisterPage from "../pages/IndividualRegisterPage";
import VolunteerRegisterPage from "../pages/VolunteerRegisterPage";

import BusinessDashboard from "../pages/BusinessDashboard";
import NGODashboard from "../pages/NGODashboard";
import IndividualDashboard from "../pages/IndividualDashboard";
import VolunteerDashboard from "../pages/VolunteerDashboard";

import AddDonationPage from "../pages/AddDonationPage";
import DonationHistoryPage from "../pages/DonationHistoryPage";
import InventoryPage from "../pages/InventoryPage";
import AddInventoryPage from "../pages/AddInventoryPage";
import InsightsPage from "../pages/InsightsPage";
import ProfilePage from "../pages/ProfilePage";
import AlertsPage from "../pages/AlertsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/select-account" element={<SelectAccountPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Registration */}
        <Route
          path="/register/business"
          element={<BusinessRegisterPage />}
        />

        <Route
          path="/register/ngo"
          element={<NGORegisterPage />}
        />

        <Route
          path="/register/individual"
          element={<IndividualRegisterPage />}
        />

        <Route
          path="/register/volunteer"
          element={<VolunteerRegisterPage />}
        />

        {/* Dashboards */}
        <Route
          path="/dashboard/business"
          element={<BusinessDashboard />}
        />

        <Route
          path="/dashboard/ngo"
          element={<NGODashboard />}
        />

        <Route
          path="/dashboard/individual"
          element={<IndividualDashboard />}
        />

        <Route
          path="/dashboard/volunteer"
          element={<VolunteerDashboard />}
        />

        {/* Donation */}
        <Route
          path="/donations/add"
          element={<AddDonationPage />}
        />

        <Route
          path="/donations/"
          element={<DonationHistoryPage />}
        />

        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/add" element={<AddInventoryPage />} />
        
        <Route
          path="/insights"
          element={<InsightsPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/alerts"
          element={<AlertsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}