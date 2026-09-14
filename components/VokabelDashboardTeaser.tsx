"use client";

import { useEffect, useState } from "react";
import { Inter, Rubik } from "next/font/google";
import type { VokabelStats } from "@/lib/vokabel";
import VokabelDashboard from "@/app/dashboards/vokabel/VokabelDashboard";
import "@/app/dashboards/vokabel/vokabel-theme.css";

// Loaded only for this section -- Vokabel's own fonts, not the portfolio's.
const vokabelSans = Inter({ subsets: ["latin"], variable: "--font-vokabel-sans" });
const vokabelDisplay = Rubik({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-vokabel-display" });

const VOKABEL_API_URL = process.env.NEXT_PUBLIC_VOKABEL_API_URL ?? "http://localhost:8001";

export default function VokabelDashboardTeaser() {
  // undefined = still loading, null = fetch failed, otherwise the real stats.
  // Fetched client-side (this homepage route is otherwise statically
  // prerendered) so a flaky build-time network path can't bake a stale
  // "unavailable" state into the static page for the next few minutes.
  const [stats, setStats] = useState<VokabelStats | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch(`${VOKABEL_API_URL}/public/stats`)
      .then((res) => (res.ok ? (res.json() as Promise<VokabelStats>) : null))
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            This section fetches Vokabel&apos;s own public, read-only <code>/public/stats</code> endpoint right
            in your browser and renders the result using Vokabel&apos;s actual design system.
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
          {stats === undefined ? (
            <div className="vokabel-scope sticker p-6 text-center">
              <p className="eyebrow mb-1">Vokabel</p>
              <p style={{ color: "var(--color-ink-secondary)" }}>Loading live stats…</p>
            </div>
          ) : (
            <VokabelDashboard stats={stats} />
          )}
        </div>
      </div>
    </section>
  );
}
