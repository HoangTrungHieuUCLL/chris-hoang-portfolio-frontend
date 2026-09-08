"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Project } from "@/lib/api";

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] bg-paper"
        onClick={(e) => e.stopPropagation()}
      >
        {project.image_url && (
          <div className="relative h-64 sm:h-80">
            <Image src={project.image_url} alt={project.name} fill className="object-cover" />
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-paper text-ink flex items-center justify-center shadow-md hover:opacity-80 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-8">
          <p className="text-[13px] tracking-wide text-subtle mb-2">
            {project.category}
            {project.organization ? ` · ${project.organization}` : ""} · {project.year}
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">{project.name}</h3>
          <p className="text-base sm:text-lg leading-relaxed text-ink/90 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="text-[12px] rounded-full bg-mist px-2.5 py-1 text-subtle">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              {project.link_url ? (
                <a
                  href={project.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-ink text-paper px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  {project.link_label ?? "View Project"} ↗
                </a>
              ) : null}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-subtle hover:text-ink transition-colors underline underline-offset-4"
                >
                  View the code on GitHub ↗
                </a>
              )}
            </div>
            {project.image_credit_name && (
              <a
                href={project.image_credit_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-subtle hover:text-ink transition-colors"
              >
                Photo: {project.image_credit_name} on Unsplash
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
