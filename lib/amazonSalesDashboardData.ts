import rawProducts from "@/lib/data/amazonSalesDashboard.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  discountedPrice: number;
  actualPrice: number;
  discountPct: number;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  subcategory: string;
};

export const products = rawProducts as Product[];

// The catalog is dominated by 4 categories (Electronics, Home&Kitchen,
// Computers&Accessories, OfficeProducts = ~99% of products); the remaining 5
// categories carry 1-2 products each, so they're grouped as "Other" for
// filtering and charting rather than cluttering the UI with near-empty slices.
export const TOP_CATEGORIES = ["Electronics", "Home&Kitchen", "Computers&Accessories", "OfficeProducts"] as const;

export type CategoryGroup = (typeof TOP_CATEGORIES)[number] | "Other";
export type CategoryFilter = "All" | CategoryGroup;

export function getCategoryGroup(category: string): CategoryGroup {
  return (TOP_CATEGORIES as readonly string[]).includes(category) ? (category as CategoryGroup) : "Other";
}

export const FILTER_OPTIONS: CategoryFilter[] = ["All", ...TOP_CATEGORIES, "Other"];

export function filterProducts(all: Product[], filter: CategoryFilter): Product[] {
  if (filter === "All") return all;
  return all.filter((p) => getCategoryGroup(p.category) === filter);
}
