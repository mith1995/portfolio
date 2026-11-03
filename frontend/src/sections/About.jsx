import { useProfile } from "../ProfileContext.js";
import SectionHeading from "./SectionHeading.jsx";

export default function About() {
  const profile = useProfile();

  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeading label="About" title={profile.about_heading || `About ${profile.full_name}`} />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-3xl p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-3xl shadow-glow">
            🐍
          </div>
          <div className="mt-6 space-y-4 leading-7 text-slate-300">
            {profile.about_paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {profile.highlights.map((h) => (
            <div key={h.title} className="glass rounded-3xl p-6">
              <p className="text-3xl font-bold text-white">{h.title}</p>
              <p className="mt-3 leading-7 text-slate-300">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
