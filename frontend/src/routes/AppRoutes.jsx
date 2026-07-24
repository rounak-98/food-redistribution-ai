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
import AdminDashboard from "../pages/AdminDashboard";

import AddDonationPage from "../pages/AddDonationPage";

import DonationHistoryPage from "../pages/DonationHistoryPage";
import InventoryPage from "../pages/InventoryPage";
import AddInventoryPage from "../pages/AddInventoryPage";
import InsightsPage from "../pages/InsightsPage";
import ProfilePage from "../pages/ProfilePage";
import AlertsPage from "../pages/AlertsPage";

import AvailableDonationsPage from "../pages/AvailableDonationsPage";
import AcceptedDonationsPage from "../pages/AcceptedDonationsPage";
import NGOHistoryPage from "../pages/NGOHistoryPage";
import NGOProfilePage from "../pages/NGOProfilePage";
import DonationDetailsPage from "../pages/DonationDetailsPage";
import BarcodeScanner from "../pages/BarcodeScanner";

import IndividualDonationsPage from "../pages/IndividualDonationsPage";
import IndividualNGOsPage from "../pages/IndividualNGOsPage";
import IndividualBadgesPage from "../pages/IndividualBadgesPage";
import IndividualProfilePage from "../pages/IndividualProfilePage";

import VolunteerRequestsPage from "../pages/VolunteerRequestsPage";
import VolunteerScheduledPage from "../pages/VolunteerScheduledPage";
import VolunteerKarmaPage from "../pages/VolunteerKarmaPage";
import VolunteerProfilePage from "../pages/VolunteerProfilePage";

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
        <Route path="/register/business" element={<BusinessRegisterPage />} />
        <Route path="/register/ngo" element={<NGORegisterPage />} />
        <Route path="/register/individual" element={<IndividualRegisterPage />} />
        <Route path="/register/volunteer" element={<VolunteerRegisterPage />} />

        {/* Dashboards */}
        <Route path="/dashboard/business" element={<BusinessDashboard />} />
        <Route path="/dashboard/ngo" element={<NGODashboard />} />
        <Route path="/dashboard/individual" element={<IndividualDashboard />} />
        <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />


        {/* Donation & Inventory */}
        <Route path="/donations/add" element={<AddDonationPage />} />
        <Route path="/donations/history" element={<DonationHistoryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/add" element={<AddInventoryPage />} />
        <Route path="/analytics" element={<InsightsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/alerts" element={<AlertsPage />} />

        {/* NGO Pages */}
        <Route path="/ngo/donations" element={<AvailableDonationsPage />} />
        <Route path="/ngo/accepted" element={<AcceptedDonationsPage />} />
        <Route path="/ngo/history" element={<NGOHistoryPage />} />
        <Route path="/ngo/profile" element={<NGOProfilePage />} />
        <Route path="/ngo/donation-details/:id" element={<DonationDetailsPage />} />
        <Route path="/inventory/scan" element={<BarcodeScanner />} />

        {/* Individual Pages */}
        <Route path="/individual/donations" element={<IndividualDonationsPage />} />
        <Route path="/individual/ngos" element={<IndividualNGOsPage />} />
        <Route path="/individual/badges" element={<IndividualBadgesPage />} />
        <Route path="/individual/profile" element={<IndividualProfilePage />} />

        {/* Volunteer Pages */}
        <Route path="/volunteer/requests" element={<VolunteerRequestsPage />} />
        <Route path="/volunteer/scheduled" element={<VolunteerScheduledPage />} />
        <Route path="/volunteer/karma" element={<VolunteerKarmaPage />} />
        <Route path="/volunteer/profile" element={<VolunteerProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}