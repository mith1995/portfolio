export default function SectionHeading({ label, title }) {
  return (
    <div className="mb-12">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">{label}</p>
      <h2 className="section-title mt-4 text-3xl font-bold text-white md:text-4xl">{title}</h2>
    </div>
  );
}
