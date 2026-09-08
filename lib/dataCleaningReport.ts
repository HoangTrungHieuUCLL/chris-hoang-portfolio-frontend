// Content for the Amazon Sales data-cleaning report: a homepage teaser
// (DataCleaningReport.tsx) and the full write-up (app/reports/[slug]/page.tsx).
// Source: https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning

export type ChecklistCheck = {
  label: string;
  finding: string;
  action: string;
  code?: string;
};

export type ChecklistSection = {
  step: string;
  title: string;
  intro?: string;
  checks: ChecklistCheck[];
};

export const dataCleaningReport = {
  slug: "amazon-sales-data-cleaning",
  title: "Amazon Sales Dataset: Data Cleaning Report",
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
    "5 numeric columns stored as text (currency symbols, commas, percent signs): cast to float64",
    "92 duplicate product_id rows: collapsed to one row per product with an explicit, column-by-column aggregation rule, not a blind drop",
    "3 missing values (1 rating, 2 rating_count): diagnosed as isolated scrape failures (MCAR) and imputed with the column median",
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
          code: `# Price columns: remove currency symbol and thousands separator, then cast to float
for col in ['discounted_price', 'actual_price']:
    df[col] = df[col].str.replace('₹', '', regex=False).str.replace(',', '', regex=False).astype(float)

# Percentage column: remove trailing '%', cast to float
df['discount_percentage'] = df['discount_percentage'].str.replace('%', '', regex=False).astype(float)

# Rating: cast to float, coercing the malformed entry found below to NaN instead of erroring
df['rating'] = pd.to_numeric(df['rating'], errors='coerce')

# Rating count: remove thousands separator, coerce to float (handles the 2 missing values found below)
df['rating_count'] = pd.to_numeric(df['rating_count'].str.replace(',', '', regex=False), errors='coerce')`,
        },
        {
          label: "Data range constraints",
          finding: "Checked rating in [0, 5], discount_percentage in [0, 100], and both price columns > 0.",
          action: "All values were in range once parsed. Nothing to clip or drop.",
        },
        {
          label: "Uniqueness constraints",
          finding:
            "0 exact duplicate rows. But 92 products appeared on more than one row: investigation showed each row carried a different batch of customer reviews for the same product, not a redundant copy.",
          action:
            "Collapsed to one row per product with a per-column aggregation rule: rating averaged, rating_count averaged (a cumulative snapshot, not a per-row delta, so summing would have inflated it roughly 3x), review_id replaced by a summed review_count, free-text review fields concatenated, and near-constant fields (name, category, prices) taken from the first row. Result: 1,465 raw rows collapsed to 1,351 rows, one per product.",
          code: `# Per-row review count, computed before collapsing (each row's review_id is a comma-separated list)
df['review_count'] = df['review_id'].str.split(',').apply(len)

agg_rules = {
    'product_name': 'first',
    'category': 'first',
    'discounted_price': 'first',
    'actual_price': 'first',
    'discount_percentage': 'first',
    'about_product': 'first',
    'img_link': 'first',
    'product_link': 'first',
    'rating': lambda s: round(s.mean(), 1),
    # np.round (not the builtin round) so an all-missing group's NaN mean passes through
    # cleanly instead of raising when converting NaN to int
    'rating_count': lambda s: np.round(s.mean()),
    'review_count': 'sum',
    'user_id': lambda s: ','.join(s),
    'user_name': lambda s: ','.join(s),
    'review_title': lambda s: ','.join(s),
    'review_content': lambda s: ','.join(s),
}

df = df.groupby('product_id', as_index=False).agg(agg_rules)`,
        },
        {
          label: "Derived column",
          finding: "The kept discount_percentage was worth cross-checking against the final price pair per product.",
          action:
            "Added discount_percentage_calculated, computed as (actual_price minus discounted_price) divided by actual_price times 100, rounded to 2 decimals.",
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
          action: "Found exactly 9 distinct, consistently-spelled categories. No remapping needed.",
        },
        {
          label: "Length violation for text data",
          finding: "Checked product_id against the fixed 10-character Amazon ASIN format.",
          action: "All values conform. Nothing to fix.",
          code: `id_lengths = df['product_id'].str.len()
print(id_lengths.value_counts())

malformed_ids = df[~df['product_id'].str.match(r'^[A-Z0-9]{10}$')]
print(f'product_id values not matching the 10-char ASIN pattern: {len(malformed_ids)}')`,
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
          label: "Unit uniformity (numeric columns)",
          finding: "Verified every price used the same currency symbol before conversion.",
          action: "No mixed currencies. Ratings consistently 0 to 5, discounts consistently 0 to 100%.",
        },
        {
          label: "Unit uniformity (date columns)",
          finding: "This dataset has no date/datetime columns.",
          action: "N/A.",
        },
        {
          label: "Crossfield validation (numeric columns)",
          finding:
            "Checked (a) discounted_price never exceeds actual_price, and (b) the stated discount_percentage matches the price-implied value.",
          action: "Zero violations on both counts.",
          code: `price_violation = df[df['discounted_price'] > df['actual_price']]
print(f'Rows where discounted_price > actual_price: {len(price_violation)}')

implied_discount_pct = ((df['actual_price'] - df['discounted_price']) / df['actual_price'] * 100).round(0)
discount_pct_mismatch = df[(implied_discount_pct - df['discount_percentage']).abs() > 1]
print(f'Rows where stated discount_percentage differs from the price-implied value by >1pt: {len(discount_pct_mismatch)}')`,
        },
        {
          label: "Crossfield validation (date columns)",
          finding: "No date columns to cross-validate.",
          action: "N/A.",
        },
      ],
    },
    {
      step: "4",
      title: "Missing Data",
      intro:
        "Two columns carried missing or malformed values after type conversion. rating had 1 row with the literal string \"|\" instead of a number (a scraping artifact; the product had 992 ratings, so it clearly had a real average that failed to scrape), and rating_count had 2 blank rows, though both products had a valid rating, implying the same class of scraping gap.",
      checks: [
        {
          label: "Classification",
          finding:
            "Each gap affected only 1 to 2 rows (0.1% of the dataset), isolated to scrape failures rather than a pattern tied to other attributes.",
          action: "Classified as Missing Completely at Random (MCAR).",
        },
        {
          label: "Treatment",
          finding: "Every other column for the affected rows was intact.",
          action: "Imputed both columns with the column median rather than dropping the rows.",
          code: `rating_median = df['rating'].median()
rating_count_median = df['rating_count'].median()

df['rating'] = df['rating'].fillna(rating_median)
df['rating_count'] = df['rating_count'].fillna(rating_count_median)`,
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
    { item: "Derived column", finding: "N/A", action: "Added discount_percentage_calculated" },
    { item: "Categorical membership", finding: "9 clean top-level categories", action: "None needed" },
    { item: "Text length", finding: "All ASINs valid", action: "None needed" },
    { item: "Text formatting", finding: "No whitespace/delimiter issues", action: "None needed; added category_main" },
    { item: "Unit uniformity", finding: "Single currency, consistent scales", action: "None needed" },
    { item: "Crossfield validation", finding: "Prices & discounts internally consistent", action: "None needed" },
    { item: "Missing data", finding: "3 cells (1 rating, 2 rating_count), MCAR", action: "Imputed with column median" },
  ],
};
