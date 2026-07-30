import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PasswordInput from "./PasswordInput";
import { login } from "../../services/authService";
import useAuthStore from "../../store/authStore";

export default function LoginForm({ role = "Doctor" }) {
  const navigate = useNavigate();
  const auth = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email, password);

      auth.login(result.user, result.access_token);

      // Redirect based on user's role
      switch (result.user.role) {
        case "doctor":
          navigate("/doctor/dashboard", { replace: true });
          break;

        case "patient":
          navigate("/patient/dashboard", { replace: true });
          break;

        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;

        default:
          navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h2 className="mb-2 text-center text-3xl font-bold text-white">
        {role} Login
      </h2>

      <p className="mb-8 text-center text-slate-400">
        Sign in to your MastiskhNet account
      </p>

      <input
        type="email"
        placeholder="Email Address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing In..." : `Login as ${role}`}
      </button>
    </form>
  );
}