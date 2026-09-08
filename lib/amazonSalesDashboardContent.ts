// Content for the Amazon Sales interactive dashboard: a homepage teaser
// (SalesDashboardTeaser.tsx) and the full dashboard (app/dashboards/[slug]/page.tsx).
// Built on top of the cleaned dataset from the data-cleaning report (see
// lib/dataCleaningReport.ts) — same source, one level further downstream.

export const salesDashboard = {
  slug: "amazon-sales",
  title: "Amazon Sales: Interactive Manager Dashboard",
  eyebrow: "Interactive Dashboard",
  year: "2026",
  repoUrl: "https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning",
  summary:
    "An executive snapshot built on the cleaned Amazon product catalog: 1,351 products, filterable by category, covering assortment mix, pricing and discount strategy, customer satisfaction, and product-level leaderboards.",
  glimpse:
    "The dataset has no order dates or unit sales, so this isn't a revenue-over-time dashboard: it's a catalog snapshot. Popularity and revenue exposure are modelled from cumulative rating volume, clearly labelled as proxies rather than actuals.",
  proxyNote:
    "This dataset has no order dates, quantities, or transaction revenue — it's a product catalog snapshot, not a sales ledger. Two metrics below are modelled proxies rather than actuals: rating volume stands in for demand, and revenue exposure (price × rating volume) stands in for sales value. Both are flagged wherever they appear.",
  skills: ["React", "TypeScript", "Next.js", "Recharts", "Data Visualization", "Exploratory Data Analysis"],
  highlights: [
    "1,351 products across 9 categories, filterable down to one category at a time",
    "Revenue-exposure and demand proxies, clearly labelled given the dataset has no transaction-level sales data",
    "Discount-vs-rating correlation recomputed live per category — spoiler: deeper discounts don't buy better ratings",
  ],
  businessQuestions: [
    "Which categories and subcategories dominate the catalog, and where is assortment concentrated vs. thin?",
    "How does discount depth vary by category — who discounts hardest, who barely discounts?",
    "Does discounting actually correlate with more engagement or better ratings, or not?",
    "Where do products cluster by price tier, and which tiers get the deepest discounts?",
    "Are there pockets of underperforming ratings hiding inside a category?",
    "Which products have high popularity but mediocre ratings — an at-risk-satisfaction flag?",
    "What are the top products by estimated demand, and by estimated revenue exposure?",
  ],
};
