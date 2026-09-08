"""
Builds lib/data/amazonSalesDashboard.json from the cleaned Amazon Sales dataset.

Source of truth: https://github.com/HoangTrungHieuUCLL/amazon-sales-data-cleaning
(datasets/amazon_cleaned.csv). Pulls the raw CSV over HTTP so the frontend repo
never has to carry a duplicate copy of the dataset.

Usage:
    python3 scripts/build-sales-dashboard-data.py

Requires: pandas
"""

import json
import urllib.request
from pathlib import Path

import pandas as pd

CSV_URL = (
    "https://raw.githubusercontent.com/HoangTrungHieuUCLL/"
    "amazon-sales-data-cleaning/main/datasets/amazon_cleaned.csv"
)
OUTPUT_PATH = Path(__file__).parent.parent / "lib" / "data" / "amazonSalesDashboard.json"

KEEP_COLUMNS = {
    "product_id": "id",
    "product_name": "name",
    "category_main": "category",
    "discounted_price": "discountedPrice",
    "actual_price": "actualPrice",
    "discount_percentage": "discountPct",
    "rating": "rating",
    "rating_count": "ratingCount",
    "review_count": "reviewCount",
}


def main() -> None:
    with urllib.request.urlopen(CSV_URL) as response:
        df = pd.read_csv(response)

    df["subcategory"] = df["category"].apply(
        lambda value: value.split("|")[1] if len(value.split("|")) > 1 else value
    )

    df["rating_count"] = df["rating_count"].round().astype(int)
    df["review_count"] = df["review_count"].astype(int)

    # Built column-by-column (rather than a blanket df.rename) because the source
    # frame already has a 'category' column (the full pipe-delimited hierarchy)
    # distinct from category_main, which we rename to 'category' here.
    out = pd.DataFrame(
        {new_name: df[old_name] for old_name, new_name in KEEP_COLUMNS.items()}
    )
    out["subcategory"] = df["subcategory"]
    records = out.to_dict(orient="records")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(records, separators=(",", ":")))

    print(f"Wrote {len(records)} products to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
