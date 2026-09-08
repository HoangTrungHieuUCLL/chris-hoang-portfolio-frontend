"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/api";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

// Curated set shown first, in this order, regardless of category or date:
// the strongest, most relevant work for a recruiter skimming the page.
const HIGHLIGHTED_SLUGS = [
  "automated-sales-forecast-pipeline",
  "store-kpi-dashboard",
  "sales-impact-pricing-analysis",
  "ai-talent-matching-system",
  "faulty-gas-bottle-detection",
  "football-tactic-prediction",
];

export default function Projects({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState<Project | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const bySlug = new Map<string, Project>(projects.map((p) => [p.slug, p] as [string, Project]));
  const highlighted = HIGHLIGHTED_SLUGS.map((slug) => bySlug.get(slug)).filter((p): p is Project => Boolean(p));
  const highlightedSlugs = new Set(highlighted.map((p) => p.slug));
  const rest = projects.filter((p) => !highlightedSlugs.has(p.slug));
  // Falls back to plain project order if the curated slugs ever drift from
  // what the API actually returns, so the section never renders empty.
  const ordered = highlighted.length > 0 ? [...highlighted, ...rest] : projects;

  function updateEdges() {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  useEffect(() => {
    updateEdges();
  }, [ordered.length]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section id="projects" className="bg-mist py-28">
      <div className="max-w-content mx-auto section-pad flex items-end justify-between mb-10">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle">Projects</h2>

        {ordered.length > 1 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={atStart}
              aria-label="Scroll projects left"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:bg-paper transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={atEnd}
              aria-label="Scroll projects right"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:bg-paper transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="max-w-content mx-auto section-pad text-subtle">
          Projects are loading in. Check back shortly, or view the source on{" "}
          <a href="https://github.com/HoangTrungHieuUCLL" className="underline" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      ) : (
        <div
          ref={scrollerRef}
          onScroll={updateEdges}
          className="overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          <div className="flex gap-6 pl-6 sm:pl-10 lg:pl-[max(1.5rem,calc((100vw-1120px)/2))] pr-6">
            {ordered.map((project) => (
              <ProjectCard key={project.id} project={project} onExpand={setExpanded} />
            ))}
          </div>
        </div>
      )}

      {expanded && <ProjectModal project={expanded} onClose={() => setExpanded(null)} />}
    </section>
  );
}
