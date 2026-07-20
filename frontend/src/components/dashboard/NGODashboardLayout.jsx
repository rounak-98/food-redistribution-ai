import { useState } from "react";
import NGOSidebar from "./NGOSidebar";
import Topbar from "./Topbar";

export default function NGODashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-slate-100">

      <NGOSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
          {children}
        </main>

      </div>

    </div>
  );
}