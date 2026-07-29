import { Link } from "react-router-dom";

import {
  FaUpload,
  FaUsers,
  FaComments,
  FaFileMedical,
} from "react-icons/fa";


const actions = [
  {
    title: "Upload MRI",
    icon: <FaUpload />,
    link: "/doctor/dashboard/upload",
  },
  {
    title: "Patients",
    icon: <FaUsers />,
    link: "/doctor/dashboard/patients",
  },
  {
    title: "Reports",
    icon: <FaFileMedical />,
    link: "/doctor/dashboard/reports",
  },
  {
    title: "Chat",
    icon: <FaComments />,
    link: "/doctor/dashboard/chat",
  },
];


export default function QuickActions() {

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >

      <h2
        className="
          mb-6
          text-xl
          font-bold
          text-slate-900
        "
      >
        Quick Actions
      </h2>



      <div className="grid grid-cols-2 gap-4">

        {actions.map((action) => (

          <Link
            key={action.title}
            to={action.link}
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-5
              text-center
              transition-all
              hover:border-blue-500
              hover:bg-blue-50
              hover:shadow-md
            "
          >

            <div
              className="
                mb-3
                flex
                justify-center
                text-3xl
                text-blue-600
              "
            >
              {action.icon}
            </div>


            <p
              className="
                font-medium
                text-slate-800
              "
            >
              {action.title}
            </p>


          </Link>

        ))}

      </div>

    </div>
  );
}