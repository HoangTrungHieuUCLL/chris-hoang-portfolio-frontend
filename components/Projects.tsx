"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/api";
import ProjectCard from "./ProjectCard";

export default function Projects({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="bg-mist">
      <div className="max-w-content mx-auto section-pad py-28">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
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
          <p className="text-subtle">
            Projects are loading in — check back shortly, or view the source on{" "}
            <a href="https://github.com/HoangTrungHieuUCLL" className="underline" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
