import { useProfile } from "../ProfileContext.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Skills() {
  const { skill_groups } = useProfile();
  if (skill_groups.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <SectionHeading label="Skills" title="Tools and technologies I use to build applications." />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {skill_groups.map((group) => (
          <div key={group.title} className="glass rounded-3xl p-6">
            <p className="text-xl font-semibold text-white">{group.title}</p>
            <ul className="mt-4 space-y-2 text-slate-300">
              {group.skills.map((skill) => (
                <li key={skill}>• {skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
