// Content for the Amazon Sales interactive dashboard: a homepage teaser
// (SalesDashboardTeaser.tsx) and the full dashboard (app/dashboards/[slug]/page.tsx).
// Built on top of the cleaned dataset from the data-cleaning report, see
// lib/dataCleaningReport.ts, one level further downstream.

export const salesDashboard = {
  slug: "amazon-sales",
  title: "Amazon Sales: Interactive Manager Dashboard",
  eyebrow: "Interactive Dashboard",
  year: "2026",
  repoUrl: "https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning",
  summary:
    "An executive snapshot built on the cleaned Amazon product catalog: 1,351 products, filterable by category, covering assortment mix, pricing and discount strategy, customer satisfaction, and product-level leaderboards.",
  proxyNote:
    "This dataset has no order dates, quantities, or transaction revenue: it's a product catalog snapshot, not a sales ledger. Two metrics below are modelled proxies rather than actuals: rating volume stands in for demand, and revenue exposure (price times rating volume) stands in for sales value. Both are flagged wherever they appear.",
  skills: ["React", "TypeScript", "Next.js", "Recharts", "Data Visualization", "Exploratory Data Analysis"],
  highlights: [
    "1,351 products across 9 categories, filterable down to one category at a time",
    "Revenue exposure and demand proxies, clearly labelled given the dataset has no transaction-level sales data",
    "Discount vs. rating correlation recomputed live per category: deeper discounts don't buy better ratings",
  ],
  // Short, chip-sized phrasing: shown as pills right under the intro so a
  // manager sees the dashboard's scope in one glance, before any chart.
  businessQuestions: [
    "Where does the catalog concentrate?",
    "Who discounts the hardest?",
    "Does discounting buy better ratings?",
    "Which bestsellers are at satisfaction risk?",
    "Who are the top products by demand and revenue?",
  ],
};
