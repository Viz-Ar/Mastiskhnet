import AuthBackground from "../components/auth/AuthBackground";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">

      <AuthBackground />

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

    </div>
  );
}