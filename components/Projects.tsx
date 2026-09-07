"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/api";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

const CARD_STEP = 344; // card width (320px) + gap (24px)

export default function Projects({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const [active, setActive] = useState("All");
  const [expanded, setExpanded] = useState<Project | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    setCanScrollPrev(false);
    setCanScrollNext(el.scrollWidth > el.clientWidth + 8);
  }, [active]);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  function scroll(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * CARD_STEP, behavior: "smooth" });
  }

  return (
    <section id="projects" className="bg-mist py-28">
      <div className="max-w-content mx-auto section-pad flex flex-wrap items-center justify-between gap-6 mb-10">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle">Projects</h2>
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  active === cat
                    ? "bg-ink text-paper"
                    : "bg-paper text-subtle border border-line hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="max-w-content mx-auto section-pad text-subtle">
          Projects are loading in — check back shortly, or view the source on{" "}
          <a href="https://github.com/HoangTrungHieuUCLL" className="underline" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      ) : (
        <>
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 pl-6 sm:pl-10 lg:pl-[max(2.5rem,calc((100vw-1120px)/2))] pr-6"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onExpand={setExpanded} />
            ))}
          </div>

          <div className="max-w-content mx-auto section-pad flex items-center gap-3 mt-6">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous projects"
              className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-paper transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollNext}
              aria-label="Next projects"
              className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-paper transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      )}

      {expanded && <ProjectModal project={expanded} onClose={() => setExpanded(null)} />}
    </section>
  );
}
