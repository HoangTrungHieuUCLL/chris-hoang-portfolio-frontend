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
import { filterProducts, products, type CategoryFilter } from "@/lib/amazonSalesDashboardData";
import {
  computeAtRiskProducts,
  computeDiscountByCategory,
  computeKpis,
  computePriceTiers,
  computeRatingDistribution,
  computeSubcategoryMix,
  formatCompactINR,
  formatCompactNumber,
} from "@/lib/amazonSalesDashboardStats";

export default function AmazonSalesDashboardApp() {
  const [filter, setFilter] = useState<CategoryFilter>("All");

  const filtered = useMemo(() => filterProducts(products, filter), [filter]);
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const subcategoryMix = useMemo(() => computeSubcategoryMix(filtered), [filtered]);
  const discountByCategory = useMemo(() => computeDiscountByCategory(products, filter), [filter]);
  const priceTiers = useMemo(() => computePriceTiers(filtered), [filtered]);
  const ratingDistribution = useMemo(() => computeRatingDistribution(filtered), [filtered]);
  const atRisk = useMemo(() => computeAtRiskProducts(filtered), [filtered]);

  return (
    <>
      {/* Filter + KPI strip */}
      <section className="bg-mist py-14">
        <div className="max-w-content mx-auto section-pad">
          <CategoryFilterBar value={filter} onChange={setFilter} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
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

      {/* Portfolio mix */}
      <section className="max-w-content mx-auto section-pad py-24">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-2">Portfolio Mix</h2>
        <p className="text-base text-subtle leading-relaxed max-w-2xl mb-8">
          Subcategories within {filter === "All" ? "the full catalog" : filter}, ranked by product count — where the
          assortment concentrates.
        </p>
        <div className="rounded-[20px] border border-line bg-paper p-6">
          <PortfolioMixChart data={subcategoryMix} />
        </div>
      </section>

      {/* Pricing & discount strategy */}
      <section className="bg-mist py-24">
        <div className="max-w-content mx-auto section-pad">
          <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-2">Pricing &amp; Discount Strategy</h2>
          <p className="text-base text-subtle leading-relaxed max-w-2xl mb-8">
            Discount depth by category (benchmarked against the full catalog) and how the selected products spread
            across price tiers.
          </p>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-[20px] border border-line bg-paper p-6">
              <h3 className="text-[14px] font-semibold text-ink mb-4">Avg. discount by category</h3>
              <DiscountByCategoryChart data={discountByCategory} />
            </div>
            <div className="rounded-[20px] border border-line bg-paper p-6">
              <h3 className="text-[14px] font-semibold text-ink mb-4">Price tier distribution</h3>
              <BucketBarChart data={priceTiers} />
            </div>
          </div>
        </div>
      </section>

      {/* Discount vs rating */}
      <section className="max-w-content mx-auto section-pad py-24">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-2">Discount vs. Engagement</h2>
        <p className="text-base text-subtle leading-relaxed max-w-2xl mb-8">
          Every product in this selection, plotted by discount depth against customer rating.
        </p>
        <div className="rounded-[20px] border border-line bg-paper p-6">
          <DiscountVsRatingScatter products={filtered} />
        </div>
      </section>

      {/* Satisfaction & risk */}
      <section className="bg-mist py-24">
        <div className="max-w-content mx-auto section-pad">
          <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-2">Satisfaction &amp; Risk</h2>
          <p className="text-base text-subtle leading-relaxed max-w-2xl mb-8">
            How ratings are distributed, and products that pair high popularity with a below-median rating.
          </p>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-[20px] border border-line bg-paper p-6">
              <h3 className="text-[14px] font-semibold text-ink mb-4">Rating distribution</h3>
              <BucketBarChart data={ratingDistribution} unitLabel="products" />
            </div>
            <div className="rounded-[20px] border border-line bg-paper p-6">
              <h3 className="text-[14px] font-semibold text-ink mb-4">At-risk products</h3>
              <AtRiskList products={atRisk} />
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="max-w-content mx-auto section-pad py-24">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-2">Product Leaderboards</h2>
        <p className="text-base text-subtle leading-relaxed max-w-2xl mb-8">
          Top 15 products in this selection, re-sortable by demand proxy, revenue exposure, rating, or discount
          depth.
        </p>
        <ProductLeaderboard products={filtered} />
      </section>
    </>
  );
}
