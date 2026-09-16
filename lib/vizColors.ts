// Dashboard chart palette, deliberately separate from the site palette.
//
// The portfolio's chrome is near-grayscale (tailwind.config.ts:
// ink/paper/mist/line/subtle) plus three role hues under `role.*`, which encode
// which lane a project belongs to and nothing else. Charts do not reuse those:
// a bar coloured like the "AI Engineer" tag would imply a link that isn't there.
// So charts keep exactly one accent hue - none of this dashboard's charts need
// simultaneous distinct-hue series. Values are the dataviz skill's validated
// defaults (categorical slot 1 / fixed status "critical"), reused for their
// documented roles rather than invented per-chart.
export const VIZ_ACCENT = "#2a78d6"; // primary series (bars, scatter points)
export const VIZ_MUTED = "#d2d2d7"; // de-emphasized bars (= tailwind `line`)
export const VIZ_CRITICAL = "#d03b3b"; // "at risk" flag only - always paired with an icon + label
export const VIZ_GRID = "#e1e0d9"; // hairline gridlines
export const VIZ_AXIS_TEXT = "#6e6e73"; // = tailwind `subtle`
