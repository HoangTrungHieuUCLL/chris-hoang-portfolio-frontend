import type { Project } from "@/lib/api";

export default function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.link_url ? "a" : "div";
  const wrapperProps = project.link_url
    ? { href: project.link_url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex flex-col justify-between rounded-2xl border border-line p-7 h-full hover:border-ink transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[13px] text-subtle">{project.year}</span>
          {project.organization && (
            <span className="text-[13px] text-subtle">{project.organization}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:underline underline-offset-4">
          {project.name}
        </h3>
        <p className="text-[15px] text-subtle leading-relaxed">{project.description}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tech_stack.map((tech) => (
          <span key={tech} className="text-[12px] rounded-full bg-mist px-2.5 py-1 text-subtle">
            {tech}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}
