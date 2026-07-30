import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";


export default function DoctorDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        {/* Header */}
        <DashboardHeader />


        {/* Child Routes */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}