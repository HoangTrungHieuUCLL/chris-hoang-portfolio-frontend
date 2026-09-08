"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import type { Product } from "@/lib/amazonSalesDashboardData";
import { pearsonCorrelation } from "@/lib/amazonSalesDashboardStats";
import { VIZ_ACCENT, VIZ_AXIS_TEXT, VIZ_GRID } from "@/lib/vizColors";

type Props = {
  products: Product[];
};

function correlationReadout(r: number): string {
  const magnitude = Math.abs(r);
  if (magnitude < 0.1) return "essentially no relationship";
  if (magnitude < 0.3) return "a weak relationship";
  if (magnitude < 0.5) return "a moderate relationship";
  return "a strong relationship";
}

export default function DiscountVsRatingScatter({ products }: Props) {
  const correlation = pearsonCorrelation(
    products.map((p) => p.discountPct),
    products.map((p) => p.rating)
  );

  return (
    <div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid stroke={VIZ_GRID} />
            <XAxis
              type="number"
              dataKey="discountPct"
              name="Discount"
              unit="%"
              domain={[0, 100]}
              tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
              axisLine={{ stroke: VIZ_GRID }}
              tickLine={false}
              label={{ value: "Discount %", position: "insideBottom", offset: -2, fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="rating"
              name="Rating"
              domain={[2, 5]}
              tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
              axisLine={{ stroke: VIZ_GRID }}
              tickLine={false}
              label={{ value: "Rating", angle: -90, position: "insideLeft", fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            />
            <ZAxis range={[24, 24]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: VIZ_GRID }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as Product | undefined;
                if (!point) return null;
                return (
                  <ChartTooltip
                    active={active}
                    value={`${point.rating}★ · ${point.discountPct}% off`}
                    label={point.name.length > 48 ? `${point.name.slice(0, 48)}…` : point.name}
                  />
                );
              }}
            />
            <Scatter data={products} fill={VIZ_ACCENT} fillOpacity={0.35} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[13px] text-subtle leading-relaxed mt-3 px-1">
        Correlation coefficient: <span className="font-semibold text-ink">{correlation.toFixed(2)}</span> —{" "}
        {correlationReadout(correlation)} between discount depth and rating in this selection. Deeper discounts do
        not reliably buy a better rating here.
      </p>
    </div>
  );
}
