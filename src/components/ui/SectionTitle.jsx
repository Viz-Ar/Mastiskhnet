import GradientText from "./GradientText";

export default function SectionTitle({
  badge,
  title,
  gradient,
  description,
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {badge && (
        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          {badge}
        </span>
      )}

      <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
        {title}{" "}
        {gradient && (
          <GradientText>{gradient}</GradientText>
        )}
      </h2>

      <p className="mt-6 text-lg text-slate-400">
        {description}
      </p>
    </div>
  );
}