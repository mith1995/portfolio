import ProjectCard from "../components/ProjectCard.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Projects({ projects, loading, error }) {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeading label="Projects" title="Selected work with video walkthroughs." />

      {loading && <p className="text-slate-400">Loading projects...</p>}
      {error && <p className="text-red-300">Could not load projects.</p>}
      {!loading && !error && projects.length === 0 && (
        <p className="text-slate-400">No projects yet. Add one in the admin panel.</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
