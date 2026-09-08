// Dashboard chart palette. The portfolio itself is intentionally near-grayscale
// (see tailwind.config.ts: ink/paper/mist/line/subtle), so charts get exactly one
// accent hue rather than a multi-hue categorical set - none of this dashboard's
// charts need simultaneous distinct-hue series. Values are the dataviz skill's
// validated defaults (categorical slot 1 / fixed status "critical"), reused for
// their documented roles rather than invented per-chart.
export const VIZ_ACCENT = "#2a78d6"; // primary series (bars, scatter points)
export const VIZ_MUTED = "#d2d2d7"; // de-emphasized bars (= tailwind `line`)
export const VIZ_CRITICAL = "#d03b3b"; // "at risk" flag only - always paired with an icon + label
export const VIZ_GRID = "#e1e0d9"; // hairline gridlines
export const VIZ_AXIS_TEXT = "#6e6e73"; // = tailwind `subtle`
