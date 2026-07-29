import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  value,
  onChange,
}) {

  const [show, setShow] = useState(false);

  return (
    <div className="relative">

      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>

    </div>
  );
}