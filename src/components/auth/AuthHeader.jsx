import { FaBrain } from "react-icons/fa";

export default function AuthHeader({
  title,
  subtitle,
}) {
  return (
    <div className="mb-8 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl">

        <FaBrain className="text-4xl text-white" />

      </div>

      <h2 className="mt-6 text-3xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-3 text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}