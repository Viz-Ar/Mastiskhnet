import GlassCard from "./GlassCard";

export default function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <GlassCard className="p-8">
      <div className="mb-6 text-cyan-400">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-400">
        {description}
      </p>
    </GlassCard>
  );
}