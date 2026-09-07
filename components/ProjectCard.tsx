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
    <div className="relative flex-shrink-0 w-[78vw] sm:w-[320px] h-[520px] rounded-[28px] bg-ink overflow-hidden flex flex-col snap-start">
      <div className="p-6 pb-4">
        <p className="text-[12px] tracking-wide text-paper/60 mb-2">
          {project.category}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <h3 className="text-[21px] font-semibold text-paper leading-snug">{project.name}</h3>
      </div>

      <div className="relative flex-1">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.name}
            fill
            sizes="(min-width: 640px) 320px, 78vw"
            className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
          />
        ) : null}

        <button
          onClick={() => onExpand(project)}
          aria-label={`More about ${project.name}`}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-paper text-ink flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
