import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../api";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { useProfile } from "../ProfileContext.js";
import useApi from "../useApi.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const profile = useProfile();
  const { data: project, error, loading } = useApi(() => getProject(slug), [slug]);

  useEffect(() => {
    if (project) document.title = `${project.title} | ${profile.full_name}`;
  }, [project, profile.full_name]);

  if (loading) return <p className="p-10 text-center text-slate-400">Loading...</p>;

  if (error || !project) {
    return (
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold text-white">
          {error?.status === 404 ? "Project not found" : "Could not load project"}
        </h1>
        <Link to="/#projects" className="mt-6 inline-block text-cyan-300 hover:text-cyan-200">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Link to="/#projects" className="text-sm text-slate-300 hover:text-white">
        ← Back to projects
      </Link>

      <section className="mt-8 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            {project.category}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{project.short_description}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm text-violet-100">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                Open live project
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                className="inline-flex rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300">
                View source code
              </a>
            )}
            <Link to="/#contact"
              className="inline-flex rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300">
              Discuss a project
            </Link>
          </div>
        </div>

        <div>
          {project.videos.length > 0 ? (
            <VideoPlayer videos={project.videos} poster={project.thumbnail} />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/60 to-cyan-600/50 p-6 text-center">
              <p className="text-slate-100">Walkthrough video coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-12 border-t border-slate-800 py-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">Overview</p>
          <p className="mt-4 whitespace-pre-line leading-8 text-slate-300">{project.summary}</p>
        </div>
        <div className="space-y-8">
          {project.challenge && (
            <div>
              <h2 className="text-xl font-bold text-white">The challenge</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-300">{project.challenge}</p>
            </div>
          )}
          {project.solution && (
            <div>
              <h2 className="text-xl font-bold text-white">The solution</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-slate-300">{project.solution}</p>
            </div>
          )}
        </div>
      </section>

      {project.features.length > 0 && (
        <section className="border-t border-slate-800 py-12">
          <h2 className="text-2xl font-bold text-white">Key features</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-slate-300">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
