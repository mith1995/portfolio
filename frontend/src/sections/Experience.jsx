import { useProfile } from "../ProfileContext.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Experience() {
  const { experiences } = useProfile();
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeading label="Experience" title="Where I have worked." />

      <div className="space-y-6">
        {experiences.map((job, i) => (
          <div key={`${job.company}-${job.period}-${i}`} className="glass rounded-3xl p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-bold text-white">{job.role}</p>
                <p className="text-slate-300">{job.company}</p>
              </div>
              <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-violet-200">
                {job.period}
              </span>
            </div>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-300">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
