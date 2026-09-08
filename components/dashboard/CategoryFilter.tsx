"use client";

import { FILTER_OPTIONS, type CategoryFilter } from "@/lib/amazonSalesDashboardData";

type Props = {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
};

export default function CategoryFilterBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
      {FILTER_OPTIONS.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              isActive ? "bg-ink text-paper" : "bg-mist text-subtle hover:text-ink"
            }`}
          >
            {option === "All" ? "All Categories" : option}
          </button>
        );
      })}
    </div>
  );
}
