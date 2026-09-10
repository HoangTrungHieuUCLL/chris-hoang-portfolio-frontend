import Link from "next/link";
import { dataCleaningReport as report } from "@/lib/dataCleaningReport";
import { SKILL_ICONS } from "@/lib/skillIcons";

export default function DataCleaningReport() {
  const { stats } = report;

  return (
    <section id="data-cleaning" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">{report.eyebrow}</h2>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3">
          <h3 className="text-3xl sm:text-4xl font-semibold tracking-tightest leading-tight mb-5 text-balance">
            {report.title}
          </h3>
          <p className="text-lg text-ink leading-relaxed mb-4">{report.summary}</p>
          <p className="text-base text-subtle leading-relaxed mb-6">{report.glimpse}</p>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {report.skills.map((skill) => {
              const Icon = SKILL_ICONS[skill];
              return (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-[12px] rounded-full bg-mist px-2.5 py-1 text-subtle"
                >
                  {Icon ? <Icon size={12} aria-hidden /> : null}
                  {skill}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href={`/reports/${report.slug}`}
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium transition hover:opacity-80 active:scale-[0.97]"
            >
              Read the Report
            </Link>
            <a
              href={report.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-subtle hover:text-ink transition-colors underline underline-offset-4"
            >
              View source on GitHub ↗
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-[28px] bg-ink text-paper p-8">
          <p className="text-[12px] tracking-wide text-paper/60 mb-1">Dataset</p>
          <p className="text-lg font-semibold mb-6">
            {report.dataset.name}{" "}
            <a
              href={report.dataset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/60 hover:text-paper transition-colors font-normal text-sm"
            >
              ({report.dataset.sourceLabel} ↗)
            </a>
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-paper/60 mb-1">Rows</p>
              <p className="text-2xl font-semibold">
                {stats.rawRows.toLocaleString()} → {stats.cleanedRows.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-paper/60 mb-1">Columns</p>
              <p className="text-2xl font-semibold">
                {stats.rawCols} → {stats.cleanedCols}
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {report.highlights.map((point) => (
              <li key={point} className="text-[13px] text-paper/80 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full bg-paper/40" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
