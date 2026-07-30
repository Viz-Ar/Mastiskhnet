import GlassCard from "./GlassCard";

export default function StatCard({
  number,
  label,
}) {
  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-4xl font-bold text-cyan-400">
        {number}
      </h2>

      <p className="mt-2 text-slate-300">
        {label}
      </p>
    </GlassCard>
  );
}