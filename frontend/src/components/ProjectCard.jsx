import { Link } from "react-router-dom";

// Full class names (not built dynamically) so Tailwind can find them.
const VARIANTS = [
  {
    bg: "from-violet-600 via-indigo-600 to-cyan-500",
    chip: "bg-violet-500/10 text-violet-200",
    btn: "border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500",
  },
  {
    bg: "from-cyan-500 via-sky-600 to-indigo-700",
    chip: "bg-cyan-500/10 text-cyan-200",
    btn: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500",
  },
  {
    bg: "from-emerald-500 via-teal-500 to-cyan-500",
    chip: "bg-emerald-500/10 text-emerald-200",
    btn: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500",
  },
];

export default function ProjectCard({ project, index }) {
  const v = VARIANTS[index % VARIANTS.length];

  return (
    <article className="project-card glass group overflow-hidden rounded-3xl p-0">
      <div className={`h-60 overflow-hidden bg-gradient-to-br ${v.bg}`}>
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-end p-5">
            <p className="text-2xl font-black text-white/90">{project.title}</p>
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {project.category}
        </p>
        <h3 className="mt-2 text-xl font-bold text-white">{project.title}</h3>
        <p className="mt-3 leading-7 text-slate-300">{project.short_description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className={`rounded-full px-2.5 py-1 text-xs ${v.chip}`}>
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/projects/${project.slug}`}
          className={`mt-6 inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:text-white ${v.btn}`}
        >
          {project.has_video ? "View details + video" : "View details"}
        </Link>
      </div>
    </article>
  );
}
