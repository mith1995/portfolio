import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../ProfileContext.js";

export default function Hero({ projectCount }) {
  const profile = useProfile();
  const [slide, setSlide] = useState(0);
  const points = profile.focus_points;

  useEffect(() => {
    if (points.length < 2) return undefined;
    const timer = setInterval(() => setSlide((s) => (s + 1) % points.length), 2600);
    return () => clearInterval(timer);
  }, [points.length]);

  const stack = profile.skill_groups.flatMap((g) => g.skills).slice(0, 5);

  return (
    <section id="home" className="mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {profile.availability_text && (
            <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              {profile.availability_text}
            </div>
          )}

          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            I build <span className="gradient-text">modern web applications</span> with Python and React.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{profile.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/#projects"
              className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
            >
              View My Work
            </Link>
            <Link
              to="/#contact"
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-violet-500 hover:text-violet-200"
            >
              Let's Connect
            </Link>
            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300"
              >
                Download Resume
              </a>
            )}
          </div>

          {points.length > 0 && (
            <div className="mt-10 rounded-3xl border border-violet-500/20 bg-slate-950/60 p-4 shadow-glow">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Core focus</p>
              <div className="mt-4 min-h-[56px]">
                <p key={slide} className="hero-slide text-lg font-semibold text-white">
                  {points[slide]}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-6 shadow-glow">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Profile</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{profile.full_name}</h2>
              </div>
              <img
                src={profile.photo || "/me.jpeg"}
                alt={profile.full_name}
                className="h-20 w-20 shrink-0 rounded-2xl border border-violet-500/40 object-cover object-top shadow-lg shadow-violet-500/20"
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Specialization</p>
                <p className="mt-2 text-lg font-semibold text-violet-200">{profile.headline}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Projects</p>
                  <p className="mt-2 text-3xl font-bold text-white">{projectCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Experience</p>
                  <p className="mt-2 text-3xl font-bold text-white">{profile.experience_label || "-"}</p>
                </div>
              </div>

              {stack.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Core Stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stack.map((name) => (
                      <span key={name} className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
