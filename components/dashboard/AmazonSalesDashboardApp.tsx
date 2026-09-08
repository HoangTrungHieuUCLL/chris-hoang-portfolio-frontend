"use client";

import { useMemo, useState } from "react";
import AtRiskList from "@/components/dashboard/AtRiskList";
import BucketBarChart from "@/components/dashboard/BucketBarChart";
import CategoryFilterBar from "@/components/dashboard/CategoryFilter";
import DiscountByCategoryChart from "@/components/dashboard/DiscountByCategoryChart";
import DiscountVsRatingScatter from "@/components/dashboard/DiscountVsRatingScatter";
import PortfolioMixChart from "@/components/dashboard/PortfolioMixChart";
import ProductLeaderboard from "@/components/dashboard/ProductLeaderboard";
import StatTile from "@/components/dashboard/StatTile";
import TabBar from "@/components/dashboard/TabBar";
import { filterProducts, products, type CategoryFilter } from "@/lib/amazonSalesDashboardData";
import {
  computeAtRiskProducts,
  computeDiscountByCategory,
  computeKpis,
  computeRatingDistribution,
  computeSubcategoryMix,
  formatCompactINR,
  formatCompactNumber,
} from "@/lib/amazonSalesDashboardStats";

const TABS = [
  { key: "mix", label: "Portfolio Mix" },
  { key: "pricing", label: "Pricing & Discounts" },
  { key: "satisfaction", label: "Satisfaction & Leaderboard" },
];

export default function AmazonSalesDashboardApp() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [tab, setTab] = useState(TABS[0].key);

  const filtered = useMemo(() => filterProducts(products, filter), [filter]);
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const subcategoryMix = useMemo(() => computeSubcategoryMix(filtered, 8), [filtered]);
  const discountByCategory = useMemo(() => computeDiscountByCategory(products, filter), [filter]);
  const ratingDistribution = useMemo(() => computeRatingDistribution(filtered), [filtered]);
  const atRisk = useMemo(() => computeAtRiskProducts(filtered), [filtered]);

  return (
    <>
      {/* Filter + KPI strip */}
      <section className="bg-mist py-8">
        <div className="max-w-content mx-auto section-pad">
          <CategoryFilterBar value={filter} onChange={setFilter} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            <StatTile label="Products" value={kpis.productCount.toLocaleString()} />
            <StatTile label="Categories" value={String(kpis.categoryCount)} />
            <StatTile label="Avg. rating" value={`${kpis.avgRating.toFixed(1)} / 5`} />
            <StatTile label="Avg. discount" value={`${kpis.avgDiscountPct.toFixed(0)}%`} />
            <StatTile
              label="Demand proxy"
              value={formatCompactNumber(kpis.totalRatingVolume)}
              note="Cumulative rating volume"
            />
            <StatTile
              label="Revenue exposure"
              value={formatCompactINR(kpis.estRevenueExposure)}
              note="Modelled, not actual revenue"
            />
          </div>
        </div>
      </section>

      {/* Tabbed content: only the active tab renders, so the page never
          accumulates the height of every section at once. */}
      <section className="max-w-content mx-auto section-pad py-10">
        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        <div className="mt-8">
          {tab === "mix" && (
            <div className="rounded-[20px] border border-line bg-paper p-6">
              <h3 className="text-[14px] font-semibold text-ink mb-1">Subcategory mix</h3>
              <p className="text-[13px] text-subtle mb-4">
                Where {filter === "All" ? "the full catalog" : filter} concentrates, ranked by product count.
              </p>
              <PortfolioMixChart data={subcategoryMix} />
            </div>
          )}

          {tab === "pricing" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-[20px] border border-line bg-paper p-6">
                <h3 className="text-[14px] font-semibold text-ink mb-1">Avg. discount by category</h3>
                <p className="text-[13px] text-subtle mb-4">Full catalog, selected category highlighted.</p>
                <DiscountByCategoryChart data={discountByCategory} />
              </div>
              <div className="rounded-[20px] border border-line bg-paper p-6">
                <h3 className="text-[14px] font-semibold text-ink mb-1">Discount vs. rating</h3>
                <p className="text-[13px] text-subtle mb-4">Every product in this selection.</p>
                <DiscountVsRatingScatter products={filtered} />
              </div>
            </div>
          )}

          {tab === "satisfaction" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] border border-line bg-paper p-6">
                  <h3 className="text-[14px] font-semibold text-ink mb-1">Rating distribution</h3>
                  <p className="text-[13px] text-subtle mb-4">How ratings spread in this selection.</p>
                  <BucketBarChart data={ratingDistribution} height={220} />
                </div>
                <div className="rounded-[20px] border border-line bg-paper p-6">
                  <h3 className="text-[14px] font-semibold text-ink mb-1">At-risk products</h3>
                  <p className="text-[13px] text-subtle mb-4">High popularity, below-median rating.</p>
                  <AtRiskList products={atRisk} />
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-ink mb-1">Product leaderboard</h3>
                <p className="text-[13px] text-subtle mb-4">
                  Top 15, re-sortable by demand proxy, revenue exposure, rating, or discount depth.
                </p>
                <ProductLeaderboard products={filtered} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
