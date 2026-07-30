import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";


export default function DoctorDashboard() {


  return (

    <div
      className="
      flex
      h-screen
      overflow-hidden
      bg-slate-50
      "
    >



      {/* Sidebar */}

      <aside
        className="
        hidden
        lg:block
        "
      >

        <Sidebar />

      </aside>





      {/* Main Area */}

      <div
        className="
        flex
        flex-1
        flex-col
        overflow-hidden
        "
      >



        {/* Header */}

        <DashboardHeader />





        {/* Page Content */}

        <main
          className="
          flex-1
          overflow-y-auto
          p-6
          "
        >

          <Outlet />

        </main>



      </div>


    </div>

  );

}