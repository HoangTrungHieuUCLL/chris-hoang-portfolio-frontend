import Image from "next/image";
import type { Project } from "@/lib/api";

export default function ProjectCard({
  project,
  onExpand,
}: {
  project: Project;
  onExpand: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onExpand(project)}
      aria-label={`More about ${project.name}`}
      className="group relative shrink-0 snap-start w-[82vw] sm:w-[440px] lg:w-[520px] h-[460px] rounded-[28px] overflow-hidden bg-ink text-left transition-transform duration-200 ease-out active:scale-[0.99]"
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
        <p className="text-[12px] tracking-wide text-paper/80">
          {project.category}
          {project.year ? ` · ${project.year}` : ""}
        </p>

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
