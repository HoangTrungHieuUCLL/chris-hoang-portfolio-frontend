"use client";

import { useState } from "react";
import type { Project } from "@/lib/api";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

// Curated set shown up front, in this order, regardless of category or date —
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
  const [showAll, setShowAll] = useState(false);

  const bySlug = new Map<string, Project>(projects.map((p) => [p.slug, p] as [string, Project]));
  const highlighted = HIGHLIGHTED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (p): p is Project => Boolean(p)
  );
  // Falls back to the first six projects if the curated slugs ever drift from
  // what the API actually returns, so the section never renders empty.
  const featured = highlighted.length > 0 ? highlighted : projects.slice(0, 6);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = projects.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <section id="projects" className="bg-mist py-28">
      <div className="max-w-content mx-auto section-pad">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">Projects</h2>

        {projects.length === 0 ? (
          <p className="text-subtle">
            Projects are loading in — check back shortly, or view the source on{" "}
            <a href="https://github.com/HoangTrungHieuUCLL" className="underline" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} onExpand={setExpanded} />
              ))}
            </div>

            {rest.length > 0 && (
              <>
                {showAll && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {rest.map((project, i) => (
                      <div
                        key={project.id}
                        className="animate-[fadeInUp_0.4s_ease-out_backwards]"
                        style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                      >
                        <ProjectCard project={project} onExpand={setExpanded} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    aria-expanded={showAll}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-7 py-3 text-[15px] font-medium hover:bg-ink hover:text-paper transition-colors"
                  >
                    {showAll ? "Show fewer projects" : `Show ${rest.length} more project${rest.length === 1 ? "" : "s"}`}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-transform ${showAll ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {expanded && <ProjectModal project={expanded} onClose={() => setExpanded(null)} />}
    </section>
  );
}
