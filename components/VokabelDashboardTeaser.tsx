import { Inter, Rubik } from "next/font/google";
import { getVokabelStats } from "@/lib/vokabel";
import VokabelDashboard from "@/app/dashboards/vokabel/VokabelDashboard";
import "@/app/dashboards/vokabel/vokabel-theme.css";

// Loaded only for this section -- Vokabel's own fonts, not the portfolio's.
const vokabelSans = Inter({ subsets: ["latin"], variable: "--font-vokabel-sans" });
const vokabelDisplay = Rubik({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-vokabel-display" });

export default async function VokabelDashboardTeaser() {
  const stats = await getVokabelStats();

  return (
    <section id="vokabel" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">API + Dashboard Integration</h2>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2">
          <h3 className="text-3xl sm:text-4xl font-semibold tracking-tightest leading-tight mb-5 text-balance">
            Vokabel
          </h3>
          <p className="text-lg text-ink leading-relaxed mb-6">
            A personal German vocabulary tracker: a FastAPI + PostgreSQL backend behind a separate React +
            TypeScript frontend. What&apos;s on the right isn&apos;t a screenshot -- it&apos;s a live API call.
            This section fetches Vokabel&apos;s own public, read-only <code>/public/stats</code> endpoint at
            request time and renders the result using Vokabel&apos;s actual design system.
          </p>
          <a
            href="https://github.com/HoangTrungHieuUCLL/vokabel-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-subtle hover:text-ink transition-colors underline underline-offset-4"
          >
            View source on GitHub ↗
          </a>
        </div>

        <div className={`lg:col-span-3 ${vokabelSans.variable} ${vokabelDisplay.variable}`}>
          <VokabelDashboard stats={stats} />
        </div>
      </div>
    </section>
  );
}
