import Link from "next/link";
import type { Metadata } from "next";
import AmazonSalesDashboardApp from "@/components/dashboard/AmazonSalesDashboardApp";
import QuestionChips from "@/components/dashboard/QuestionChips";
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
        <section className="max-w-content mx-auto section-pad pt-14 pb-10">
          <p className="text-sm tracking-[0.2em] uppercase text-subtle mb-4">Interactive Dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightest leading-[1.05] max-w-3xl mb-4 text-balance">
            {dashboard.title}
          </h1>
          <p className="text-base text-subtle mb-6">
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
          <p className="text-lg text-ink leading-relaxed max-w-3xl mb-6">{dashboard.summary}</p>

          <div className="mb-6">
            <QuestionChips questions={dashboard.businessQuestions} />
          </div>

          <div className="rounded-[16px] border border-line bg-mist p-5 max-w-3xl">
            <p className="text-[13px] font-semibold text-ink mb-1.5">A note on the metrics</p>
            <p className="text-[13px] text-subtle leading-relaxed">{dashboard.proxyNote}</p>
          </div>
        </section>

        <AmazonSalesDashboardApp />

        {/* Closing CTA */}
        <section className="max-w-content mx-auto section-pad py-14 text-center">
          <p className="text-base text-subtle mb-6 max-w-xl mx-auto">
            Curious how the underlying dataset got here? It started as 1,465 raw, all-text rows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reports/amazon-sales-data-cleaning"
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium transition hover:opacity-80 active:scale-[0.97]"
            >
              Read the Data Cleaning Report
            </Link>
            <Link
              href="/#projects"
              className="rounded-full border border-line px-7 py-3 text-[15px] font-medium transition hover:bg-mist active:scale-[0.97]"
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
