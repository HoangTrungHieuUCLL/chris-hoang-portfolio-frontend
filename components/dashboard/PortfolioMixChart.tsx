"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import type { SubcategoryRow } from "@/lib/amazonSalesDashboardStats";
import { VIZ_ACCENT, VIZ_AXIS_TEXT, VIZ_GRID } from "@/lib/vizColors";

type Props = {
  data: SubcategoryRow[];
  height?: number;
};

// `data` already arrives sorted largest-first; Recharts renders a vertical
// category axis in that same top-to-bottom array order, so it's used as-is.
export default function PortfolioMixChart({ data, height = 320 }: Props) {
  const chartData = data;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }} barSize={18}>
          <CartesianGrid horizontal={false} stroke={VIZ_GRID} />
          <XAxis
            type="number"
            tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            axisLine={{ stroke: VIZ_GRID }}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="subcategory"
            width={170}
            tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            axisLine={{ stroke: VIZ_GRID }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                value={payload?.[0] ? `${payload[0].value} products` : undefined}
                label={String(payload?.[0]?.payload?.subcategory ?? "")}
              />
            )}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((row) => (
              <Cell key={row.subcategory} fill={VIZ_ACCENT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
