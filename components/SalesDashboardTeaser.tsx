import Link from "next/link";
import QuestionChips from "@/components/dashboard/QuestionChips";
import { salesDashboard as dashboard } from "@/lib/amazonSalesDashboardContent";
import { products } from "@/lib/amazonSalesDashboardData";
import { computeKpis, formatCompactINR, formatCompactNumber } from "@/lib/amazonSalesDashboardStats";
import { SKILL_ICONS } from "@/lib/skillIcons";

export default function SalesDashboardTeaser() {
  const kpis = computeKpis(products);

  return (
    <section id="sales-dashboard" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">{dashboard.eyebrow}</h2>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3">
          <h3 className="text-3xl sm:text-4xl font-semibold tracking-tightest leading-tight mb-5 text-balance">
            {dashboard.title}
          </h3>
          <p className="text-lg text-ink leading-relaxed mb-6">{dashboard.summary}</p>

          <div className="mb-6">
            <QuestionChips questions={dashboard.businessQuestions} limit={3} label="It answers questions like" />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {dashboard.skills.map((skill) => {
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
              href={`/dashboards/${dashboard.slug}`}
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium transition hover:opacity-80 active:scale-[0.97]"
            >
              Launch this Dashboard
            </Link>
            <a
              href={dashboard.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-subtle hover:text-ink transition-colors underline underline-offset-4"
            >
              View source on GitHub ↗
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-[28px] bg-ink text-paper p-8">
          <p className="text-[12px] tracking-wide text-paper/60 mb-1">Built on</p>
          <p className="text-lg font-semibold mb-6">Amazon Sales Dataset (cleaned)</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-paper/60 mb-1">Products</p>
              <p className="text-2xl font-semibold">{kpis.productCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-paper/60 mb-1">Categories</p>
              <p className="text-2xl font-semibold">{kpis.categoryCount}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-paper/60 mb-1">Avg. Rating</p>
              <p className="text-2xl font-semibold">{kpis.avgRating.toFixed(1)} / 5</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-paper/60 mb-1">Rating Volume</p>
              <p className="text-2xl font-semibold">{formatCompactNumber(kpis.totalRatingVolume)}</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {dashboard.highlights.map((point) => (
              <li key={point} className="text-[13px] text-paper/80 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full bg-paper/40" aria-hidden />
                {point}
              </li>
            ))}
          </ul>

          <p className="text-[11px] text-paper/50 leading-relaxed mt-6 pt-6 border-t border-paper/15">
            Revenue exposure proxy shown on the dashboard: {formatCompactINR(kpis.estRevenueExposure)}. A modelled
            figure (price times rating volume), not actual sales revenue.
          </p>
        </div>
      </div>
    </section>
  );
}
