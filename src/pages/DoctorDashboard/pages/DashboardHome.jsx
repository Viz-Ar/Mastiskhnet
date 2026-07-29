import {
  FaUsers,
  FaBrain,
  FaFileMedical,
  FaChartLine,
} from "react-icons/fa";


import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import RecentPatients from "../components/RecentPatients";


import useDashboard from "../../../hooks/useDashboard";
import useMRIHistory from "../../../hooks/useMRIHistory";

import useAuthStore from "../../../store/authStore";



export default function DashboardHome() {


  const { user } = useAuthStore();



  const {
    stats,
    loading: dashboardLoading,
  } = useDashboard();




  const {
    history,
    loading: historyLoading,
  } = useMRIHistory(
    user?.id
  );




  if (dashboardLoading || historyLoading) {

    return (

      <div
        className="
        flex
        min-h-[300px]
        items-center
        justify-center
        text-slate-500
        "
      >

        Loading dashboard...

      </div>

    );

  }





  return (

    <div
      className="
      space-y-8
      "
    >



      {/* Statistics */}

      <div
        className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
        "
      >



        <StatCard

          title="Patients"

          value={
            stats?.patients ?? 0
          }

          icon={<FaUsers />}

          color="#0891b2"

        />





        <StatCard

          title="MRI Scans"

          value={
            stats?.mri_scans ?? 0
          }

          icon={<FaBrain />}

          color="#2563eb"

        />





        <StatCard

          title="Completed Reports"

          value={
            stats?.completed ?? 0
          }

          icon={<FaFileMedical />}

          color="#7c3aed"

        />





        <StatCard

          title="Accuracy"

          value={
            `${stats?.accuracy ?? 0}%`
          }

          icon={<FaChartLine />}

          color="#16a34a"

        />


      </div>







      {/* Main Content */}


      <div
        className="
        grid
        gap-6
        lg:grid-cols-3
        "
      >



        <div
          className="
          lg:col-span-2
          "
        >


          <RecentPatients

            patients={
              history ?? []
            }

          />


        </div>





        <QuickActions />



      </div>





    </div>

  );

}