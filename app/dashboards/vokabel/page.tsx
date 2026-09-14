import Link from "next/link";
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";
import { getVokabelStats } from "@/lib/vokabel";
import VokabelDashboard from "./VokabelDashboard";
import "./vokabel-theme.css";

// Loaded only for this page -- Vokabel's own fonts, not the portfolio's.
const vokabelSans = Inter({ subsets: ["latin"], variable: "--font-vokabel-sans" });
const vokabelDisplay = Rubik({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-vokabel-display" });

// Render per-request rather than prerendering at build time: the build step
// runs in a separate, isolated environment from the deployed service and
// hit-or-miss network access there shouldn't get baked into the static page
// for the next 5 minutes. The fetch's own revalidate: 300 still caches the
// data layer, so this doesn't mean re-fetching on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Vokabel - ${profile.name}`,
  description: "A personal German vocabulary tracker with its own API, live-fetched into this dashboard.",
  openGraph: {
    title: "Vokabel",
    description: "A personal German vocabulary tracker with its own API, live-fetched into this dashboard.",
    type: "article",
  },
};

export default async function VokabelDashboardPage() {
  const stats = await getVokabelStats();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-paper/70 backdrop-blur-md border-b border-line/70">
        <div className="max-w-content mx-auto flex items-center justify-between h-14 section-pad">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            {profile.name}
          </Link>
          <Link
            href="/#projects"
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
        <section className="max-w-content mx-auto section-pad pt-14 pb-10">
          <p className="text-sm tracking-[0.2em] uppercase text-subtle mb-4">API + Dashboard Integration</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightest leading-[1.05] max-w-3xl mb-4 text-balance">
            Vokabel
          </h1>
          <p className="text-base text-subtle mb-6">{profile.name} · 2026 · personal project</p>
          <p className="text-lg text-ink leading-relaxed max-w-3xl mb-6">
            A personal German vocabulary tracker: a FastAPI + PostgreSQL backend (search-key normalisation, typo-tolerant
            fuzzy search, per-word-type validation, CSV/JSON import and export) behind a React + TypeScript frontend,
            both deployed independently and talking only over HTTP. The tile below isn&apos;t a screenshot -- it&apos;s this
            page calling Vokabel&apos;s own public, read-only <code>/public/stats</code> endpoint at request time and
            rendering the result using Vokabel&apos;s actual design system, copied over so what you see here matches the
            real app pixel for pixel.
          </p>

          <div className="rounded-[16px] border border-line bg-mist p-5 max-w-3xl mb-10">
            <p className="text-[13px] font-semibold text-ink mb-1.5">A note on the numbers</p>
            <p className="text-[13px] text-subtle leading-relaxed">
              This is my own personal vocabulary log, so the endpoint intentionally returns aggregate counts only --
              never the words, meanings, or example sentences themselves.
            </p>
          </div>
        </section>

        <section className={`max-w-content mx-auto section-pad pb-14 ${vokabelSans.variable} ${vokabelDisplay.variable}`}>
          <VokabelDashboard stats={stats} />
        </section>
      </main>

      <Footer />
    </>
  );
}
