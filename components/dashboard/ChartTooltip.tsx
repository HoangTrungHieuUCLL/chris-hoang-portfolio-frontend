"use client";

type Props = {
  active?: boolean;
  label?: string;
  value?: string;
  valueLabel?: string;
};

// A single-series tooltip: value leads (bold, high-contrast), the category/series
// name follows as secondary text - per the dataviz skill's "values lead, labels
// follow" rule.
export default function ChartTooltip({ active, label, value, valueLabel }: Props) {
  if (!active || value === undefined) return null;
  return (
    <div className="rounded-[10px] border border-line bg-paper px-3.5 py-2.5 shadow-sm">
      <p className="text-[15px] font-semibold text-ink leading-none mb-1">{value}</p>
      <p className="text-[12px] text-subtle leading-none">
        {label}
        {valueLabel ? ` · ${valueLabel}` : ""}
      </p>
    </div>
  );
}
