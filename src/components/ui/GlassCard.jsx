export default function GlassCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      shadow-xl
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-cyan-500/40
      hover:shadow-cyan-500/20
      ${className}
    `}
    >
      {children}
    </div>
  );
}