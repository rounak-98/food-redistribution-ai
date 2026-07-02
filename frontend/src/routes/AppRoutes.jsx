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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-account" element={<SelectAccountPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register/business" element={<BusinessRegisterPage />} />
        <Route path="/register/ngo" element={<NGORegisterPage />} />
        <Route path="/register/individual" element={<IndividualRegisterPage />} />
        <Route path="/register/volunteer" element={<VolunteerRegisterPage />} />

        <Route path="/dashboard/business" element={<BusinessDashboard />} />
        <Route path="/dashboard/ngo" element={<NGODashboard />} />
        <Route path="/dashboard/individual" element={<IndividualDashboard />} />
        <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}