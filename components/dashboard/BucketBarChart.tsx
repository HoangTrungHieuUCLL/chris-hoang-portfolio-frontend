"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "@/components/dashboard/ChartTooltip";
import { VIZ_ACCENT, VIZ_AXIS_TEXT, VIZ_GRID } from "@/lib/vizColors";

type Props = {
  data: { label: string; count: number }[];
  unitLabel?: string;
  height?: number;
};

// A generic single-series bucket histogram (currently used for the
// rating-distribution chart).
export default function BucketBarChart({ data, unitLabel = "products", height = 280 }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 4 }} barSize={36}>
          <CartesianGrid vertical={false} stroke={VIZ_GRID} />
          <XAxis
            dataKey="label"
            tick={{ fill: VIZ_AXIS_TEXT, fontSize: 11 }}
            axisLine={{ stroke: VIZ_GRID }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: VIZ_AXIS_TEXT, fontSize: 12 }}
            axisLine={{ stroke: VIZ_GRID }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                value={payload?.[0] ? `${payload[0].value} ${unitLabel}` : undefined}
                label={String(payload?.[0]?.payload?.label ?? "")}
              />
            )}
          />
          <Bar dataKey="count" fill={VIZ_ACCENT} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
