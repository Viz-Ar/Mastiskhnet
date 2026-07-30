import {
  FaUserMd,
  FaEnvelope,
  FaIdBadge,
  FaShieldAlt,
  FaHospital,
  FaEdit,
  FaLock,
} from "react-icons/fa";

import useAuthStore from "../../../store/authStore";

export default function Profile() {

  const { user } = useAuthStore();

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Doctor Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account information.
        </p>

      </div>

      {/* Profile Card */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-40 rounded-t-2xl" />

        <div className="px-8 pb-8">

          <div className="-mt-16 flex flex-col items-center">

            <div
              className="
              flex
              h-32
              w-32
              items-center
              justify-center
              rounded-full
              border-4
              border-white
              bg-white
              text-5xl
              font-bold
              text-blue-600
              shadow-lg
            "
            >

              {user?.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : "D"}

            </div>

            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              {user?.full_name}
            </h2>

            <p className="mt-1 text-slate-500">
              AI Brain Tumor Specialist
            </p>

          </div>

        </div>

      </div>

      {/* Information */}

      <div className="grid gap-6 lg:grid-cols-2">

        <InfoCard
          icon={<FaUserMd />}
          title="Full Name"
          value={user?.full_name}
        />

        <InfoCard
          icon={<FaEnvelope />}
          title="Email Address"
          value={user?.email}
        />

        <InfoCard
          icon={<FaIdBadge />}
          title="Doctor ID"
          value={`#${user?.id}`}
        />

        <InfoCard
          icon={<FaShieldAlt />}
          title="Role"
          value={user?.role}
        />

        <InfoCard
          icon={<FaHospital />}
          title="Hospital"
          value="Not Assigned"
        />

        <InfoCard
          icon={<FaShieldAlt />}
          title="Account Status"
          value="Active"
        />

      </div>

      {/* Actions */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Account Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            hover:bg-blue-700
          "
          >
            <FaEdit />
            Edit Profile
          </button>

          <button
            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-slate-800
            px-6
            py-3
            font-semibold
            text-white
            hover:bg-black
          "
          >
            <FaLock />
            Change Password
          </button>

        </div>

      </div>

    </div>

  );

}

function InfoCard({
  icon,
  title,
  value,
}) {

  return (

    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
    "
    >

      <div className="flex items-center gap-4">

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-blue-100
          text-blue-600
        "
        >
          {icon}
        </div>

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {value || "-"}
          </p>

        </div>

      </div>

    </div>

  );

}