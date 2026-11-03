import { useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../ProfileContext.js";

const LINKS = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Skills", "/#skills"],
  ["Projects", "/#projects"],
  ["Experience", "/#experience"],
  ["Contact", "/#contact"],
];

export default function Navbar() {
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const firstName = profile.full_name.split(" ")[0];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/#home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-black text-slate-950">
            {firstName[0]}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              {firstName}
            </p>
            <p className="text-xs text-slate-300">{profile.headline}</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, to]) => (
            <Link key={label} to={to} className="text-sm text-slate-300 transition hover:text-white">
              {label}
            </Link>
          ))}
        </div>

        <Link
          to="/#hire"
          className="hidden rounded-full border border-violet-500/50 bg-violet-600/10 px-5 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500 hover:text-white md:inline-flex"
        >
          Hire Me
        </Link>

        <button
          className="rounded-lg border border-slate-700 p-2 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4">
            {[...LINKS, ["Hire Me", "/#hire"]].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
