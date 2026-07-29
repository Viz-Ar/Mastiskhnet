import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8 bg-slate-50">
        <Outlet />
      </main>

    </div>
  );
}