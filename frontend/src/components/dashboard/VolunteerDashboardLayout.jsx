import { useState } from "react";
import VolunteerSidebar from "./VolunteerSidebar";
import Topbar from "./Topbar";

export default function VolunteerDashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <VolunteerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
