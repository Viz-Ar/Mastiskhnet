import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../store/authStore";


export default function DashboardHeader() {


  const navigate = useNavigate();


  const {
    user,
    logout
  } = useAuthStore();




  function handleLogout() {

    logout();

    navigate("/doctor/login");

  }





  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );





  return (

    <header
      className="
      sticky
      top-0
      z-20

      flex
      h-20
      items-center
      justify-between

      border-b
      border-slate-200

      bg-white

      px-6
      lg:px-8

      shadow-sm
      "
    >




      {/* Left */}

      <div>

        <h1
          className="
          text-xl
          font-bold

          text-slate-900

          lg:text-3xl
          "
        >

          Doctor Dashboard

        </h1>



        <p
          className="
          hidden
          text-sm
          text-slate-500

          sm:block
          "
        >

          {today}

        </p>


      </div>







      {/* Search */}

      <div
        className="
        hidden

        relative
        w-full
        max-w-md

        lg:block
        "
      >


        <FaSearch
          className="
          absolute
          left-4
          top-1/2

          -translate-y-1/2

          text-slate-400
          "
        />



        <input

          type="text"

          placeholder="Search patients..."

          className="
          w-full

          rounded-xl

          border
          border-slate-200

          bg-slate-50

          py-3
          pl-12
          pr-4

          text-sm

          text-slate-900

          outline-none

          transition

          focus:border-blue-500

          focus:ring-4

          focus:ring-blue-100

          "

        />


      </div>









      {/* Right */}

      <div
        className="
        flex
        items-center

        gap-3

        lg:gap-5
        "
      >




        {/* Notification */}

        <button

          title="Notifications"

          className="
          relative

          rounded-xl

          bg-blue-50

          p-3

          text-blue-600

          transition

          hover:bg-blue-100
          "

        >

          <FaBell size={18}/>



          <span
            className="
            absolute

            right-2
            top-2

            h-2
            w-2

            rounded-full

            bg-red-500
            "
          />


        </button>








        {/* Doctor Info */}

        <div
          className="
          hidden

          text-right

          md:block
          "
        >


          <p
            className="
            font-semibold
            text-slate-900
            "
          >

            {user?.full_name || "Doctor"}

          </p>




          <p
            className="
            text-sm
            text-slate-500
            "
          >

            {user?.email || "doctor@hospital.com"}

          </p>


        </div>









        {/* Avatar */}

        <div
          className="
          flex

          h-12
          w-12

          items-center
          justify-center

          rounded-full

          bg-gradient-to-r

          from-blue-600

          to-cyan-500

          text-lg

          font-bold

          text-white

          shadow-md
          "
        >


          {
            user?.full_name

            ?

            user.full_name
              .charAt(0)
              .toUpperCase()

            :

            "D"
          }


        </div>









        {/* Logout */}

        <button

          title="Logout"

          onClick={handleLogout}

          className="
          rounded-xl

          bg-red-500

          p-3

          text-white

          shadow-sm

          transition

          hover:bg-red-600
          "

        >

          <FaSignOutAlt size={18}/>


        </button>



      </div>




    </header>

  );

}