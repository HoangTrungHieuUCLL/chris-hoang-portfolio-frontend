import type { Product } from "@/lib/amazonSalesDashboardData";
import { formatCompactNumber } from "@/lib/amazonSalesDashboardStats";
import { VIZ_CRITICAL } from "@/lib/vizColors";

type Props = {
  products: Product[];
};

export default function AtRiskList({ products }: Props) {
  if (products.length === 0) {
    return (
      <p className="text-[13px] text-subtle leading-relaxed">
        No products in this selection combine high popularity with a below-median rating.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {products.map((p) => (
        <li key={p.id} className="flex items-start justify-between gap-4 rounded-[14px] border border-line p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill={VIZ_CRITICAL} aria-hidden>
                <path d="M12 2 1 21h22L12 2zm0 6 6.5 11h-13L12 8z" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: VIZ_CRITICAL }}>
                At risk
              </span>
            </div>
            <p className="text-[14px] text-ink truncate">{p.name}</p>
            <p className="text-[12px] text-subtle mt-0.5">{p.category}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[15px] font-semibold text-ink">{p.rating}★</p>
            <p className="text-[12px] text-subtle">{formatCompactNumber(p.ratingCount)} ratings</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
