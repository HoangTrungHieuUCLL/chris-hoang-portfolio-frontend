type Props = {
  label: string;
  value: string;
  note?: string;
};

export default function StatTile({ label, value, note }: Props) {
  return (
    <div className="rounded-[20px] border border-line bg-paper p-5">
      <p className="text-[11px] uppercase tracking-wide text-subtle mb-1.5">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {note && <p className="text-[11px] text-subtle mt-1 leading-snug">{note}</p>}
    </div>
  );
}
