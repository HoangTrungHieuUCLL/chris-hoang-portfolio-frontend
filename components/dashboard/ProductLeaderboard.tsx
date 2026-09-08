"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/amazonSalesDashboardData";
import {
  estRevenue,
  formatCompactINR,
  formatCompactNumber,
  formatINR,
  sortForLeaderboard,
  type LeaderboardSort,
} from "@/lib/amazonSalesDashboardStats";

type Props = {
  products: Product[];
};

const SORT_OPTIONS: { key: LeaderboardSort; label: string }[] = [
  { key: "ratingCount", label: "Demand proxy" },
  { key: "estRevenue", label: "Revenue exposure" },
  { key: "rating", label: "Rating" },
  { key: "discountPct", label: "Discount %" },
];

export default function ProductLeaderboard({ products }: Props) {
  const [sortBy, setSortBy] = useState<LeaderboardSort>("ratingCount");
  const rows = useMemo(() => sortForLeaderboard(products, sortBy), [products, sortBy]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-[12px] uppercase tracking-wide text-subtle mr-1">Sort by</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSortBy(opt.key)}
            aria-pressed={sortBy === opt.key}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              sortBy === opt.key ? "bg-ink text-paper" : "bg-mist text-subtle hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-line bg-paper">
        <table className="w-full text-left text-[13px] min-w-[720px]">
          <thead>
            <tr className="border-b border-line">
              <th className="p-4 font-medium text-subtle">Product</th>
              <th className="p-4 font-medium text-subtle whitespace-nowrap">Category</th>
              <th className="p-4 font-medium text-subtle whitespace-nowrap">Price</th>
              <th className="p-4 font-medium text-subtle whitespace-nowrap">Discount</th>
              <th className="p-4 font-medium text-subtle whitespace-nowrap">Rating</th>
              <th className="p-4 font-medium text-subtle whitespace-nowrap">Demand proxy</th>
              <th className="p-4 font-medium text-subtle whitespace-nowrap">Revenue exposure</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 align-top">
                <td className="p-4 text-ink max-w-[280px]">
                  <span className="line-clamp-2">{p.name}</span>
                </td>
                <td className="p-4 text-subtle whitespace-nowrap">{p.category}</td>
                <td className="p-4 text-ink whitespace-nowrap">{formatINR(p.discountedPrice)}</td>
                <td className="p-4 text-ink whitespace-nowrap">{p.discountPct}%</td>
                <td className="p-4 text-ink whitespace-nowrap">{p.rating}★</td>
                <td className="p-4 text-ink whitespace-nowrap">{formatCompactNumber(p.ratingCount)}</td>
                <td className="p-4 text-ink whitespace-nowrap">{formatCompactINR(estRevenue(p))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-subtle mt-3">
        Demand proxy = cumulative rating volume. Revenue exposure = price × rating volume, a modelled figure, not
        actual sales revenue.
      </p>
    </div>
  );
}
