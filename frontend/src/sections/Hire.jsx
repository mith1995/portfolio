import { Link } from "react-router-dom";
import { useProfile } from "../ProfileContext.js";

export default function Hire() {
  const profile = useProfile();

  return (
    <section id="hire" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="glass rounded-[2rem] border border-violet-500/20 p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Hire Me</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              Looking for a Django + React developer?
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              I turn requirements into working full-stack products: clean APIs on the backend and
              responsive React interfaces on the frontend.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/#contact"
                className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-glow"
              >
                Get in touch
              </Link>
              <Link
                to="/#projects"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-violet-500 hover:text-violet-200"
              >
                See projects
              </Link>
            </div>
          </div>

          {profile.open_to.length > 0 && (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-slate-300">Open to</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                  Available
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {profile.open_to.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
