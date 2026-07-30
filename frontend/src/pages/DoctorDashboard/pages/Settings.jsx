import { useEffect, useState } from "react";

import {
  FaMoon,
  FaBell,
  FaShieldAlt,
  FaKey,
  FaSave,
  FaTrash,
  FaSignOutAlt,
  FaUserMd,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../store/authStore";
import { useTheme } from "../../../context/ThemeContext";

export default function Settings() {

  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const { darkMode, setDarkMode } = useTheme();

  const [notifications, setNotifications] =
    useState(true);

  const [twoFactor, setTwoFactor] =
    useState(false);

  useEffect(() => {

    setNotifications(

      JSON.parse(
        localStorage.getItem("notifications") ??
        "true"
      )

    );

    setTwoFactor(

      JSON.parse(
        localStorage.getItem("twoFactor") ??
        "false"
      )

    );

  }, []);

  function saveSettings() {

    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      "twoFactor",
      JSON.stringify(twoFactor)
    );

    alert("Settings saved successfully.");

  }

  function clearCache() {

    localStorage.removeItem("notifications");
    localStorage.removeItem("twoFactor");

    alert("Local settings cleared.");

  }

  function changePassword() {

    alert(
      "Password change will be handled by the backend API."
    );

  }

  function handleLogout() {

    logout();

    navigate("/doctor/login");

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1
          className="
          text-3xl
          font-bold
          text-slate-900
        "
        >
          Settings
        </h1>

        <p
          className="
          mt-2
          text-slate-500
        "
        >
          Configure your MastiskhNet preferences.
        </p>

      </div>

      {/* Account */}

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
          Account
        </h2>

        <div className="flex items-center gap-4">

          <div
            className="
            rounded-xl
            bg-blue-100
            p-4
            text-blue-600
          "
          >

            <FaUserMd size={24} />

          </div>

          <div>

            <p className="font-semibold text-slate-900">

              {user?.full_name}

            </p>

            <p className="text-slate-500">

              {user?.email}

            </p>

            <p className="text-sm text-slate-400">

              Role: {user?.role}

            </p>

          </div>

        </div>

      </div>

      {/* Preferences */}

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
          Preferences
        </h2>

        <SettingItem

          icon={<FaBell />}

          title="Notifications"

          description="Receive MRI notifications."

          checked={notifications}

          onChange={() =>
            setNotifications(!notifications)
          }

        />

        <SettingItem

          icon={<FaMoon />}

          title="Dark Mode"

          description="Enable dark mode throughout the application."

          checked={darkMode}

          onChange={() =>
            setDarkMode(!darkMode)
          }

        />

        <SettingItem

          icon={<FaShieldAlt />}

          title="Two-Factor Authentication"

          description="Increase account security."

          checked={twoFactor}

          onChange={() =>
            setTwoFactor(!twoFactor)
          }

        />

      </div>

      {/* Security */}

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
          Security
        </h2>

        <div className="flex flex-wrap gap-4">

          <button

            onClick={changePassword}

            className="
            flex
            items-center
            gap-3
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
          >

            <FaKey />

            Change Password

          </button>

          <button

            onClick={clearCache}

            className="
            flex
            items-center
            gap-3
            rounded-xl
            bg-orange-500
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-orange-600
          "
          >

            <FaTrash />

            Clear Cache

          </button>

          <button

            onClick={handleLogout}

            className="
            flex
            items-center
            gap-3
            rounded-xl
            bg-red-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-red-700
          "
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

      {/* Save */}

      <div className="flex justify-end">

        <button

          onClick={saveSettings}

          className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-green-600
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:bg-green-700
        "
        >

          <FaSave />

          Save Settings

        </button>

      </div>

    </div>

  );

}

function SettingItem({

  icon,

  title,

  description,

  checked,

  onChange,

}) {

  return (

    <div
      className="
      flex
      items-center
      justify-between
      border-b
      border-slate-200
      py-5
      last:border-0
    "
    >

      <div className="flex items-center gap-4">

        <div
          className="
          rounded-xl
          bg-blue-100
          p-3
          text-blue-600
        "
        >

          {icon}

        </div>

        <div>

          <h3
            className="
            font-semibold
            text-slate-900
          "
          >
            {title}
          </h3>

          <p
            className="
            text-sm
            text-slate-500
          "
          >
            {description}
          </p>

        </div>

      </div>

      <label className="relative inline-flex cursor-pointer items-center">

        <input

          type="checkbox"

          checked={checked}

          onChange={onChange}

          className="peer sr-only"

        />

        <div
          className="
          h-6
          w-11
          rounded-full
          bg-slate-300
          transition
          peer-checked:bg-blue-600
          after:absolute
          after:left-1
          after:top-1
          after:h-4
          after:w-4
          after:rounded-full
          after:bg-white
          after:transition-all
          peer-checked:after:translate-x-5
        "
        />

      </label>

    </div>

  );

}