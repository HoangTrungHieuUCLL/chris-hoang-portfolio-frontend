import Link from "next/link";
import type { Metadata } from "next";
import AmazonSalesDashboardApp from "@/components/dashboard/AmazonSalesDashboardApp";
import Footer from "@/components/Footer";
import { salesDashboard as dashboard } from "@/lib/amazonSalesDashboardContent";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: `${dashboard.title} - ${profile.name}`,
  description: dashboard.summary,
  openGraph: {
    title: dashboard.title,
    description: dashboard.summary,
    type: "article",
  },
};

export default function AmazonSalesDashboardPage() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-paper/70 backdrop-blur-md border-b border-line/70">
        <div className="max-w-content mx-auto flex items-center justify-between h-14 section-pad">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            {profile.name}
          </Link>
          <Link
            href="/#sales-dashboard"
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
          <p className="text-sm tracking-[0.2em] uppercase text-subtle mb-5">Interactive Dashboard</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tightest leading-[1.05] max-w-3xl mb-6 text-balance">
            {dashboard.title}
          </h1>
          <p className="text-base text-subtle mb-8">
            {profile.name} · {dashboard.year} · built on the cleaned{" "}
            <a
              href={dashboard.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              Amazon Sales Dataset ↗
            </a>
          </p>
          <p className="text-xl text-ink leading-relaxed max-w-3xl mb-8">{dashboard.summary}</p>

          <div className="rounded-[16px] border border-line bg-mist p-5 max-w-3xl">
            <p className="text-[13px] font-semibold text-ink mb-1.5">A note on the metrics</p>
            <p className="text-[13px] text-subtle leading-relaxed">{dashboard.proxyNote}</p>
          </div>
        </section>

        <AmazonSalesDashboardApp />

        {/* Business questions this dashboard answers */}
        <section className="bg-mist py-24">
          <div className="max-w-content mx-auto section-pad">
            <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-8">
              Business Questions This Dashboard Answers
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl">
              {dashboard.businessQuestions.map((q) => (
                <li key={q} className="text-[15px] text-ink leading-relaxed pl-5 relative">
                  <span className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full bg-ink/40" aria-hidden />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-content mx-auto section-pad py-24 text-center">
          <p className="text-lg text-subtle mb-8 max-w-xl mx-auto">
            Curious how the underlying dataset got here? It started as 1,465 raw, all-text rows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reports/amazon-sales-data-cleaning"
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium hover:opacity-80 transition-opacity"
            >
              Read the Data Cleaning Report
            </Link>
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
