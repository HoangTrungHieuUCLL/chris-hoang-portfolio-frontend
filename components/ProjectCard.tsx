import Image from "next/image";
import type { Project } from "@/lib/api";
import { ROLE_DOT_ON_DARK, ROLE_LABEL, ROLE_TEXT_ON_DARK, rolesForProject } from "@/lib/roles";

export default function ProjectCard({
  project,
  onExpand,
  dimmed = false,
}: {
  project: Project;
  onExpand: (project: Project) => void;
  /** Outside the visitor's selected lane: still readable, just not the focus. */
  dimmed?: boolean;
}) {
  const roles = rolesForProject(project.slug);

  return (
    <button
      type="button"
      onClick={() => onExpand(project)}
      aria-label={`More about ${project.name}`}
      className={`group relative shrink-0 snap-start w-[82vw] sm:w-[440px] lg:w-[520px] h-[460px] rounded-[28px] overflow-hidden bg-ink text-left transition duration-200 ease-out active:scale-[0.99] hover:opacity-100 focus-visible:opacity-100 ${
        dimmed ? "opacity-75" : "opacity-100"
      }`}
    >
      {project.image_url ? (
        <Image
          src={project.image_url}
          alt=""
          fill
          sizes="(min-width: 1024px) 520px, (min-width: 640px) 440px, 82vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : null}

      {/* Scrim so the overlaid text (now a full description + tech chips, not
          just a title) stays legible over any photo. Explicit rgba stops
          (ink = #1d1d1f) rather than Tailwind's from/via/to utilities, so the
          dark zone reliably covers the taller text block below. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(29,29,31,0.95)_0%,rgba(29,29,31,0.55)_48%,rgba(29,29,31,0)_85%)]" />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Lane tags first, in their own hue - a recruiter can read the row's
            range off the colours without reading a single title. A project can
            carry none, in which case only the category text shows. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] tracking-wide">
          {roles.map((role) => (
            <span key={role} className={`inline-flex items-center gap-1.5 font-medium ${ROLE_TEXT_ON_DARK[role]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ROLE_DOT_ON_DARK[role]}`} aria-hidden />
              {ROLE_LABEL[role]}
            </span>
          ))}
          <span className="text-paper/60">
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-paper leading-snug mb-2 text-balance">{project.name}</h3>
          <p className="text-[13px] text-paper/80 leading-relaxed line-clamp-2 mb-3">{project.description}</p>

          {project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span key={tech} className="text-[11px] rounded-full bg-paper/15 px-2.5 py-1 text-paper/85">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper text-ink px-5 py-2.5 text-[13px] font-medium group-hover:opacity-80 transition-opacity">
            Learn more
          </span>
        </div>
      </div>
    </button>
  );
}
