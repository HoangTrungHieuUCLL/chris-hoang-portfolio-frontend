// Content for the Amazon Sales data-cleaning report: a homepage teaser
// (DataCleaningReport.tsx) and the full write-up (app/reports/[slug]/page.tsx).
// Source: https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning

export type ChecklistCheck = {
  label: string;
  finding: string;
  action: string;
};

export type ChecklistSection = {
  step: string;
  title: string;
  intro?: string;
  checks: ChecklistCheck[];
};

export const dataCleaningReport = {
  slug: "amazon-sales-data-cleaning",
  title: "Amazon Sales Dataset — Data Cleaning Report",
  eyebrow: "Featured Report",
  year: "2026",
  dataset: {
    name: "Amazon Sales Dataset",
    sourceLabel: "Kaggle",
    sourceUrl: "https://www.kaggle.com/datasets/arshuuuuuuu/amazon",
  },
  repoUrl: "https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning",
  notebookUrl:
    "https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning/blob/main/amazon_sales_data_cleaning.ipynb",
  summary:
    "A step-by-step audit of a messy Amazon product-and-reviews export, following the DataCamp Data Cleaning Checklist end to end: data constraints, text and categorical data, uniformity, and missing data. Every check is documented, including the ones that turned up nothing to fix, so the notebook reads as a complete record rather than a highlight reel.",
  glimpse:
    "1,465 rows across 16 all-text columns, with 92 products scattered over duplicate rows and three malformed cells hiding in plain sight. Working through the checklist surfaced what was actually wrong: not one bulk find-and-replace, but five separate defects each needing its own justified fix.",
  skills: ["Python", "pandas", "NumPy", "Jupyter", "Data Cleaning", "Data Validation", "Exploratory Data Analysis"],
  stats: {
    rawRows: 1465,
    cleanedRows: 1351,
    rawCols: 16,
    cleanedCols: 18,
    columnsRetyped: 5,
    duplicateIdsResolved: 92,
    valuesImputed: 3,
  },
  highlights: [
    "5 numeric columns stored as text (currency symbols, commas, percent signs) — cast to float64",
    "92 duplicate product_id rows — collapsed to one row per product with an explicit, column-by-column aggregation rule, not a blind drop",
    "3 missing values (1 rating, 2 rating_count) — diagnosed as isolated scrape failures (MCAR) and imputed with the column median",
  ],
  checklist: [
    {
      step: "1",
      title: "Data Constraints",
      checks: [
        {
          label: "Data type constraints",
          finding:
            "discounted_price, actual_price, discount_percentage, rating, and rating_count all loaded as text, because of embedded ₹ symbols, thousands separators, and % signs.",
          action: "Stripped the symbols and cast all five columns to float64.",
        },
        {
          label: "Data range constraints",
          finding:
            "Checked rating ∈ [0, 5], discount_percentage ∈ [0, 100], and both price columns > 0.",
          action: "All values were in range once parsed — nothing to clip or drop.",
        },
        {
          label: "Uniqueness constraints",
          finding:
            "0 exact duplicate rows. But 92 products appeared on more than one row — investigation showed each row carried a different batch of customer reviews for the same product, not a redundant copy.",
          action:
            "Collapsed to one row per product with a per-column aggregation rule: rating averaged, rating_count averaged (it's a cumulative snapshot, not a per-row delta — summing would have ~3× inflated it), review_id replaced by a summed review_count, free-text review fields concatenated, and near-constant fields (name, category, prices) taken from the first row. Result: 1,465 raw rows → 1,351 rows, one per product.",
        },
        {
          label: "Derived column",
          finding: "The kept discount_percentage was worth cross-checking against the final price pair per product.",
          action:
            "Added discount_percentage_calculated = (actual_price − discounted_price) / actual_price × 100, rounded to 2 decimals.",
        },
      ],
    },
    {
      step: "2",
      title: "Text & Categorical Data",
      checks: [
        {
          label: "Membership constraints for categorical data",
          finding: "Checked the top-level category segment for spelling/casing inconsistencies.",
          action: "Found exactly 9 distinct, consistently-spelled categories — no remapping needed.",
        },
        {
          label: "Length violation for text data",
          finding: "Checked product_id against the fixed 10-character Amazon ASIN format.",
          action: "All values conform — nothing to fix.",
        },
        {
          label: "Inconsistent formatting",
          finding: "Checked for leading/trailing whitespace and inconsistent delimiter use in product_name and category.",
          action:
            "None found. Added category_main (just the top-level category) as a convenience column so downstream grouping doesn't require re-parsing the pipe-delimited hierarchy.",
        },
      ],
    },
    {
      step: "3",
      title: "Data Uniformity",
      checks: [
        {
          label: "Unit uniformity — numeric columns",
          finding: "Verified every price used the same ₹ currency symbol before conversion.",
          action: "No mixed currencies. Ratings consistently 0–5, discounts consistently 0–100%.",
        },
        {
          label: "Unit uniformity — date columns",
          finding: "This dataset has no date/datetime columns.",
          action: "N/A.",
        },
        {
          label: "Crossfield validation — numeric columns",
          finding:
            "Checked (a) discounted_price never exceeds actual_price, and (b) the stated discount_percentage matches the price-implied value.",
          action: "Zero violations on both counts.",
        },
        {
          label: "Crossfield validation — date columns",
          finding: "No date columns to cross-validate.",
          action: "N/A.",
        },
      ],
    },
    {
      step: "4",
      title: "Missing Data",
      intro:
        "Two columns carried missing or malformed values after type conversion — rating had 1 row with the literal string \"|\" instead of a number (a scraping artifact; the product had 992 ratings, so it clearly had a real average that failed to scrape), and rating_count had 2 blank rows, though both products had a valid rating, implying the same class of scraping gap.",
      checks: [
        {
          label: "Classification",
          finding:
            "Each gap affected only 1–2 rows (0.1% of the dataset), isolated to scrape failures rather than a pattern tied to other attributes.",
          action: "Classified as Missing Completely at Random (MCAR).",
        },
        {
          label: "Treatment",
          finding: "Every other column for the affected rows was intact.",
          action: "Imputed both columns with the column median rather than dropping the rows.",
        },
      ],
    },
  ] satisfies ChecklistSection[],
  summaryTable: [
    { item: "Data types", finding: "5 columns stored as text", action: "Converted to float64" },
    { item: "Range constraints", finding: "All values in valid bounds", action: "None needed" },
    {
      item: "Uniqueness",
      finding: "92 duplicate product_ids (distinct reviews per row)",
      action: "Collapsed to 1 row/product with per-column aggregation rules",
    },
    { item: "Derived column", finding: "—", action: "Added discount_percentage_calculated" },
    { item: "Categorical membership", finding: "9 clean top-level categories", action: "None needed" },
    { item: "Text length", finding: "All ASINs valid", action: "None needed" },
    { item: "Text formatting", finding: "No whitespace/delimiter issues", action: "None needed; added category_main" },
    { item: "Unit uniformity", finding: "Single currency, consistent scales", action: "None needed" },
    { item: "Crossfield validation", finding: "Prices & discounts internally consistent", action: "None needed" },
    { item: "Missing data", finding: "3 cells (1 rating, 2 rating_count), MCAR", action: "Imputed with column median" },
  ],
};
