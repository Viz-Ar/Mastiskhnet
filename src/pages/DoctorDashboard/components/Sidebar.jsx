import { NavLink } from "react-router-dom";

import {
  FaBrain,
  FaHome,
  FaUsers,
  FaUpload,
  FaChartBar,
  FaFileMedical,
  FaComments,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";


const menuItems = [

  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/doctor/dashboard",
    exact: true,
  },


  {
    name: "Patients",
    icon: <FaUsers />,
    path: "/doctor/dashboard/patients",
  },


  {
    name: "MRI Upload",
    icon: <FaUpload />,
    path: "/doctor/dashboard/upload",
  },


  {
    name: "Predictions",
    icon: <FaChartBar />,
    path: "/doctor/dashboard/predictions",
  },


  {
    name: "Reports",
    icon: <FaFileMedical />,
    path: "/doctor/dashboard/reports",
  },


  {
    name: "Chat",
    icon: <FaComments />,
    path: "/doctor/dashboard/chat",
  },


  {
    name: "Profile",
    icon: <FaUserCircle />,
    path: "/doctor/dashboard/profile",
  },


  {
    name: "Settings",
    icon: <FaCog />,
    path: "/doctor/dashboard/settings",
  },

];



export default function Sidebar() {


  return (

    <aside
      className="
      flex
      h-screen
      w-72
      flex-col
      border-r
      border-slate-200
      bg-white
      "
    >


      {/* Logo */}

      <div
        className="
        flex
        items-center
        gap-4
        border-b
        border-slate-200
        p-6
        "
      >


        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-600
          shadow-lg
          "
        >

          <FaBrain
            size={28}
            className="text-white"
          />

        </div>



        <div>

          <h1
            className="
            text-xl
            font-bold
            text-slate-900
            "
          >
            MastiskhNet
          </h1>


          <p
            className="
            text-sm
            text-slate-500
            "
          >
            Doctor Portal
          </p>

        </div>


      </div>





      {/* Navigation */}

      <nav
        className="
        flex-1
        space-y-2
        overflow-y-auto
        px-4
        py-6
        "
      >


        {
          menuItems.map((item)=>(

            <NavLink

              key={item.name}

              to={item.path}

              end={item.exact}


              className={({isActive})=>

                `
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  isActive

                  ?

                  "bg-blue-600 text-white shadow-lg"

                  :

                  "text-slate-600 hover:bg-blue-50 hover:text-blue-600"

                }

                `

              }

            >


              <span
                className="text-lg"
              >

                {item.icon}

              </span>



              <span>

                {item.name}

              </span>


            </NavLink>


          ))
        }


      </nav>






      {/* Footer */}

      <div
        className="
        border-t
        border-slate-200
        p-6
        "
      >


        <div
          className="
          rounded-xl
          border
          border-blue-100
          bg-blue-50
          p-4
          "
        >


          <p
            className="
            text-sm
            font-bold
            text-blue-700
            "
          >

            MastiskhNet v1.0

          </p>



          <p
            className="
            mt-1
            text-xs
            leading-relaxed
            text-slate-600
            "
          >

            AI Brain Tumor Detection & Segmentation

          </p>



        </div>


      </div>


    </aside>

  );

}