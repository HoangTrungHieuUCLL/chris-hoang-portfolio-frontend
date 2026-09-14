import type { VokabelStats } from "@/lib/vokabel";

// Mirrors vokabel-frontend/src/lib/wordTypes.ts -- kept small and duplicated
// here rather than shared across repos, since there's no monorepo/package
// boundary between the portfolio and Vokabel.
const WORD_TYPES = [
  "nomen",
  "verb",
  "adjektiv",
  "adverb",
  "praeposition",
  "konjunktion",
  "pronomen",
  "partikel",
  "phrase",
] as const;

const TYPE_ABBR: Record<string, string> = {
  nomen: "NO",
  verb: "VB",
  adjektiv: "AJ",
  adverb: "AV",
  praeposition: "PR",
  konjunktion: "KJ",
  pronomen: "PN",
  partikel: "PA",
  phrase: "PH",
};

const TYPE_COLOR_VAR: Record<string, string> = {
  nomen: "--color-type-nomen",
  verb: "--color-type-verb",
  adjektiv: "--color-type-adjektiv",
  adverb: "--color-type-adverb",
  praeposition: "--color-type-praeposition",
  konjunktion: "--color-type-konjunktion",
  pronomen: "--color-type-pronomen",
  partikel: "--color-type-partikel",
  phrase: "--color-type-phrase",
};

function StatSticker({ label, value }: { label: string; value: string }) {
  return (
    <div className="sticker p-5">
      <p className="eyebrow mb-1.5">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function TypeBars({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(1, ...Object.values(counts));
  return (
    <div className="flex flex-col gap-1.5">
      {WORD_TYPES.map((type) => {
        const count = counts[type] ?? 0;
        const colorVar = `var(${TYPE_COLOR_VAR[type]})`;
        return (
          <div key={type} className="flex items-center gap-2">
            <span className="w-7 shrink-0 text-[10px] font-extrabold uppercase" style={{ color: "var(--color-ink-tertiary)" }}>
              {TYPE_ABBR[type]}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded-full" style={{ background: "var(--color-surface-alt)" }}>
              <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: colorVar }} />
            </div>
            <span className="w-6 shrink-0 text-right text-[12px] font-bold">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 120;
const CHART_PAD = 10;

function DailyLineChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = (CHART_WIDTH - CHART_PAD * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => ({
    x: CHART_PAD + i * stepX,
    y: CHART_HEIGHT - CHART_PAD - (d.count / max) * (CHART_HEIGHT - CHART_PAD * 2),
    count: d.count,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full" role="img" aria-label="Words added per day, last 30 days">
      <line
        x1={CHART_PAD}
        y1={CHART_HEIGHT - CHART_PAD}
        x2={CHART_WIDTH - CHART_PAD}
        y2={CHART_HEIGHT - CHART_PAD}
        stroke="var(--color-border-soft)"
        strokeWidth="1"
      />
      <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (p.count > 0 ? <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-accent)" /> : null))}
    </svg>
  );
}

export default function VokabelDashboard({ stats }: { stats: VokabelStats | null }) {
  if (!stats) {
    return (
      <div className="vokabel-scope sticker p-6 text-center">
        <p className="eyebrow mb-1">Vokabel</p>
        <p style={{ color: "var(--color-ink-secondary)" }}>Dashboard data is unavailable right now -- check back shortly.</p>
      </div>
    );
  }

  const addedTotal = stats.added_last_30_days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="vokabel-scope flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="chip" style={{ background: "var(--color-accent)", color: "#fff", borderColor: "var(--color-ink)" }}>
          Vokabel
        </span>
        <p className="headline text-2xl sm:text-3xl">Live word count</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatSticker label="Total words" value={String(stats.total_words)} />
        <StatSticker label="Hard to remember" value={String(stats.hard_to_remember)} />
        <StatSticker label="Added in 30 days" value={String(addedTotal)} />
      </div>

      <div className="sticker p-5">
        <p className="eyebrow mb-3">Words by type</p>
        <TypeBars counts={stats.by_type} />
      </div>

      <div className="sticker p-5">
        <p className="eyebrow mb-3">Added per day (last 30 days)</p>
        <DailyLineChart data={stats.added_last_30_days} />
      </div>
    </div>
  );
}
