import { getCategoryGroup, type CategoryFilter, type Product } from "@/lib/amazonSalesDashboardData";

// "en-US" (not "en-IN") deliberately: en-IN compact notation uses Indian
// numbering suffixes (T/L/Cr for thousand/lakh/crore), which reads as
// confusing magnitude to viewers unfamiliar with that system. K/M/B is the
// universally-understood compact format; the currency's Indian origin is
// still conveyed by the ₹ prefix alone.
export function formatCompactINR(value: number): string {
  return `₹${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function mean(values: number[]): number {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 2) return 0;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

export type Kpis = {
  productCount: number;
  categoryCount: number;
  avgRating: number;
  avgDiscountPct: number;
  totalRatingVolume: number;
  estRevenueExposure: number;
};

export function computeKpis(products: Product[]): Kpis {
  return {
    productCount: products.length,
    categoryCount: new Set(products.map((p) => p.category)).size,
    avgRating: mean(products.map((p) => p.rating)),
    avgDiscountPct: mean(products.map((p) => p.discountPct)),
    totalRatingVolume: products.reduce((sum, p) => sum + p.ratingCount, 0),
    estRevenueExposure: products.reduce((sum, p) => sum + p.discountedPrice * p.ratingCount, 0),
  };
}

export type CategoryDiscountRow = {
  category: string;
  avgDiscountPct: number;
  productCount: number;
  isSelected: boolean;
};

// Deliberately computed over the FULL catalog (not the filtered set), so the
// selected group's discount depth can be benchmarked against everyone else.
export function computeDiscountByCategory(allProducts: Product[], selectedFilter: CategoryFilter): CategoryDiscountRow[] {
  const groups = new Map<string, Product[]>();
  for (const p of allProducts) {
    const list = groups.get(p.category) ?? [];
    list.push(p);
    groups.set(p.category, list);
  }
  return [...groups.entries()]
    .map(([category, items]) => ({
      category,
      avgDiscountPct: mean(items.map((p) => p.discountPct)),
      productCount: items.length,
      isSelected: selectedFilter === "All" ? false : getCategoryGroup(category) === selectedFilter,
    }))
    .sort((a, b) => b.productCount - a.productCount);
}

export type SubcategoryRow = { subcategory: string; count: number };

export function computeSubcategoryMix(filtered: Product[], limit = 10): SubcategoryRow[] {
  const counts = new Map<string, number>();
  for (const p of filtered) {
    counts.set(p.subcategory, (counts.get(p.subcategory) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([subcategory, count]) => ({ subcategory, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

const PRICE_TIERS: { label: string; min: number; max: number }[] = [
  { label: "< ₹500", min: 0, max: 500 },
  { label: "₹500-1,000", min: 500, max: 1000 },
  { label: "₹1,000-2,500", min: 1000, max: 2500 },
  { label: "₹2,500-5,000", min: 2500, max: 5000 },
  { label: "₹5,000-10,000", min: 5000, max: 10000 },
  { label: "₹10,000+", min: 10000, max: Infinity },
];

export function computePriceTiers(filtered: Product[]): { label: string; count: number }[] {
  return PRICE_TIERS.map(({ label, min, max }) => ({
    label,
    count: filtered.filter((p) => p.actualPrice >= min && p.actualPrice < max).length,
  }));
}

const RATING_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "< 3.5", min: 0, max: 3.5 },
  { label: "3.5-4.0", min: 3.5, max: 4.0 },
  { label: "4.0-4.5", min: 4.0, max: 4.5 },
  { label: "4.5-5.0", min: 4.5, max: 5.01 },
];

export function computeRatingDistribution(filtered: Product[]): { label: string; count: number }[] {
  return RATING_BUCKETS.map(({ label, min, max }) => ({
    label,
    count: filtered.filter((p) => p.rating >= min && p.rating < max).length,
  }));
}

export function computeAtRiskProducts(filtered: Product[], limit = 5): Product[] {
  if (filtered.length < 8) return [];
  const medianRating = median(filtered.map((p) => p.rating));
  const p75RatingCount = percentile(filtered.map((p) => p.ratingCount), 75);
  return filtered
    .filter((p) => p.ratingCount >= p75RatingCount && p.rating < medianRating)
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, limit);
}

export function estRevenue(p: Product): number {
  return p.discountedPrice * p.ratingCount;
}

export type LeaderboardSort = "ratingCount" | "estRevenue" | "rating" | "discountPct";

export function sortForLeaderboard(filtered: Product[], sortBy: LeaderboardSort, limit = 15): Product[] {
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "estRevenue") return estRevenue(b) - estRevenue(a);
    return b[sortBy] - a[sortBy];
  });
  return sorted.slice(0, limit);
}
