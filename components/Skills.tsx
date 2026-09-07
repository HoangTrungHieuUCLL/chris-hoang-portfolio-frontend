import { skillGroups } from "@/lib/content";
import { SKILL_ICONS } from "@/lib/skillIcons";

export default function Skills() {
  return (
    <section id="skills" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">Skills</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-[13px] uppercase tracking-wide text-subtle mb-4">{group.label}</h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const Icon = SKILL_ICONS[skill];
                return (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm"
                  >
                    {Icon ? <Icon size={14} aria-hidden /> : null}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
