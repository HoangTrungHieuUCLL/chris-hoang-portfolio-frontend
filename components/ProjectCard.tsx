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
      className="group relative shrink-0 snap-start w-[82vw] sm:w-[440px] lg:w-[520px] h-[360px] rounded-[28px] overflow-hidden bg-ink text-left"
    >
      {project.image_url ? (
        <Image
          src={project.image_url}
          alt=""
          fill
          sizes="(min-width: 1024px) 520px, (min-width: 640px) 440px, 82vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : null}

      {/* Scrim so the overlaid text stays legible over any photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <p className="text-[12px] tracking-wide text-paper/80">
          {project.category}
          {project.year ? ` · ${project.year}` : ""}
        </p>

        <div>
          <h3 className="text-2xl font-semibold text-paper leading-snug mb-2 text-balance">{project.name}</h3>
          <p className="text-[13px] text-paper/80 leading-relaxed line-clamp-1 mb-4">{project.description}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper text-ink px-5 py-2.5 text-[13px] font-medium group-hover:opacity-80 transition-opacity">
            View Project
          </span>
        </div>
      </div>
    </button>
  );
}
