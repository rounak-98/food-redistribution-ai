import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-slate-100 min-h-screen relative overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "md:pl-20" : "md:pl-64"
        } pl-0 w-full box-border`}
      >
        <Topbar onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 w-full max-w-full box-border">
          {children}
        </main>
      </div>
    </div>
  );
}