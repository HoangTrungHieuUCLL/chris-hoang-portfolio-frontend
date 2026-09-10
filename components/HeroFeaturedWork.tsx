import Link from "next/link";
import { dataCleaningReport as report } from "@/lib/dataCleaningReport";
import { salesDashboard as dashboard } from "@/lib/amazonSalesDashboardContent";

// A condensed pointer to the two Amazon Sales projects, sized for the Hero's
// side column - the full write-up and interactive dashboard live at
// report.slug / dashboard.slug (DataCleaningReport.tsx and
// SalesDashboardTeaser.tsx render the full versions further down the page).
const items = [
  {
    href: `/reports/${report.slug}`,
    eyebrow: report.eyebrow,
    title: report.title,
    summary: report.glimpse,
  },
  {
    href: `/dashboards/${dashboard.slug}`,
    eyebrow: dashboard.eyebrow,
    title: dashboard.title,
    summary: dashboard.summary,
  },
];

export default function HeroFeaturedWork() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-[13px] tracking-[0.2em] uppercase text-subtle mb-4">Featured work</h2>
      <div className="flex flex-col gap-4 flex-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex-1 rounded-2xl border border-line p-5 transition duration-200 hover:bg-mist hover:border-line active:scale-[0.99]"
          >
            <p className="text-[11px] tracking-wide uppercase text-subtle mb-2">{item.eyebrow}</p>
            <h3 className="text-lg font-semibold tracking-tight leading-snug mb-2 text-balance">
              {item.title}
            </h3>
            <p className="text-sm text-subtle leading-relaxed line-clamp-3">{item.summary}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-ink">
              View{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
