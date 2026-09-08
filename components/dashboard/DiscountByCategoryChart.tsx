"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import type { CategoryDiscountRow } from "@/lib/amazonSalesDashboardStats";
import { VIZ_ACCENT, VIZ_AXIS_TEXT, VIZ_GRID, VIZ_MUTED } from "@/lib/vizColors";

type Props = {
  data: CategoryDiscountRow[];
};

// Always the full catalog (never filtered) so the selected category's discount
// depth can be benchmarked against the rest - see amazonSalesDashboardStats.ts.
export default function DiscountByCategoryChart({ data }: Props) {
  const chartData = [...data].reverse();

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }} barSize={16}>
          <CartesianGrid horizontal={false} stroke={VIZ_GRID} />
          <XAxis
            type="number"
            unit="%"
            tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            axisLine={{ stroke: VIZ_GRID }}
            tickLine={false}
            domain={[0, 100]}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={150}
            tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            axisLine={{ stroke: VIZ_GRID }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                value={payload?.[0] ? `${(payload[0].value as number).toFixed(1)}% avg. discount` : undefined}
                label={String(payload?.[0]?.payload?.category ?? "")}
                valueLabel={payload?.[0] ? `${payload[0].payload.productCount} products` : undefined}
              />
            )}
          />
          <Bar dataKey="avgDiscountPct" radius={[0, 4, 4, 0]}>
            {chartData.map((row) => (
              <Cell key={row.category} fill={row.isSelected ? VIZ_ACCENT : VIZ_MUTED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
