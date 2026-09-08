import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";
import { dataCleaningReport as report } from "@/lib/dataCleaningReport";
import { SKILL_ICONS } from "@/lib/skillIcons";

export const metadata: Metadata = {
  title: `${report.title} — ${profile.name}`,
  description: report.summary,
  openGraph: {
    title: report.title,
    description: report.summary,
    type: "article",
  },
};

const kpis = [
  { label: "Rows, raw → cleaned", value: `${report.stats.rawRows.toLocaleString()} → ${report.stats.cleanedRows.toLocaleString()}` },
  { label: "Columns, raw → cleaned", value: `${report.stats.rawCols} → ${report.stats.cleanedCols}` },
  { label: "Duplicate IDs resolved", value: report.stats.duplicateIdsResolved.toLocaleString() },
  { label: "Values imputed", value: report.stats.valuesImputed.toLocaleString() },
];

export default function AmazonSalesDataCleaningReportPage() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-paper/70 backdrop-blur-md border-b border-line/70">
        <div className="max-w-content mx-auto flex items-center justify-between h-14 section-pad">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            {profile.name}
          </Link>
          <Link
            href="/#data-cleaning"
            className="text-[13px] text-subtle hover:text-ink transition-colors inline-flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to portfolio
          </Link>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero */}
        <section className="max-w-content mx-auto section-pad pt-20 pb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-subtle mb-5">Data Cleaning Report</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tightest leading-[1.05] max-w-3xl mb-6">
            {report.title}
          </h1>
          <p className="text-base text-subtle mb-8">
            {profile.name} · {report.year} · dataset from{" "}
            <a
              href={report.dataset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              {report.dataset.sourceLabel} ↗
            </a>
          </p>
          <p className="text-xl text-ink leading-relaxed max-w-3xl">{report.summary}</p>

          <div className="flex flex-wrap gap-1.5 mt-8">
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

          <div className="flex flex-wrap items-center gap-6 mt-8">
            <a
              href={report.notebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium hover:opacity-80 transition-opacity"
            >
              View the Full Notebook ↗
            </a>
            <a
              href={report.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-subtle hover:text-ink transition-colors underline underline-offset-4"
            >
              View Repository ↗
            </a>
          </div>
        </section>

        {/* KPI row */}
        <section className="bg-mist py-14">
          <div className="max-w-content mx-auto section-pad grid grid-cols-2 sm:grid-cols-4 gap-8">
            {kpis.map((kpi) => (
              <div key={kpi.label}>
                <p className="text-[12px] uppercase tracking-wide text-subtle mb-1.5">{kpi.label}</p>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">{kpi.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist walkthrough */}
        <section className="max-w-content mx-auto section-pad py-24">
          <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-16">
            The Cleaning Checklist, Step by Step
          </h2>

          <div className="space-y-20">
            {report.checklist.map((section) => (
              <div key={section.step}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-sm font-medium text-subtle">{section.step}</span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{section.title}</h3>
                </div>
                {section.intro && (
                  <p className="text-base text-subtle leading-relaxed max-w-3xl mb-8">{section.intro}</p>
                )}

                <div className={section.intro ? "space-y-8" : "space-y-8 mt-8"}>
                  {section.checks.map((check) => (
                    <div
                      key={check.label}
                      className="grid sm:grid-cols-[220px_1fr] gap-2 sm:gap-8 pb-8 border-b border-line last:border-0 last:pb-0"
                    >
                      <h4 className="text-[15px] font-medium text-ink">{check.label}</h4>
                      <div className="space-y-2 max-w-2xl">
                        <p className="text-[15px] text-ink leading-relaxed">
                          <span className="text-subtle">Finding — </span>
                          {check.finding}
                        </p>
                        <p className="text-[15px] text-ink leading-relaxed">
                          <span className="text-subtle">Action — </span>
                          {check.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary table */}
        <section className="bg-mist py-24">
          <div className="max-w-content mx-auto section-pad">
            <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">Summary of Changes</h2>
            <div className="overflow-x-auto rounded-[20px] border border-line bg-paper">
              <table className="w-full text-left text-[14px] min-w-[640px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="p-4 font-medium text-subtle whitespace-nowrap">Checklist item</th>
                    <th className="p-4 font-medium text-subtle">Finding</th>
                    <th className="p-4 font-medium text-subtle">Action taken</th>
                  </tr>
                </thead>
                <tbody>
                  {report.summaryTable.map((row) => (
                    <tr key={row.item} className="border-b border-line last:border-0 align-top">
                      <td className="p-4 font-medium text-ink whitespace-nowrap">{row.item}</td>
                      <td className="p-4 text-subtle">{row.finding}</td>
                      <td className="p-4 text-ink">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-content mx-auto section-pad py-24 text-center">
          <p className="text-lg text-subtle mb-8 max-w-xl mx-auto">
            Every check above — including the ones that found nothing — runs in the notebook, against the raw
            file, end to end.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={report.notebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium hover:opacity-80 transition-opacity"
            >
              View the Notebook on GitHub ↗
            </a>
            <Link
              href="/#projects"
              className="rounded-full border border-line px-7 py-3 text-[15px] font-medium hover:bg-mist transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
