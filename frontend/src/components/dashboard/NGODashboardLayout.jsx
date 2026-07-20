import NGOSidebar from "./NGOSidebar";
import Topbar from "./Topbar";

export default function NGODashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <NGOSidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}