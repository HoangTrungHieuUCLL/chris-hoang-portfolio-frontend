type Props = {
  label: string;
  value: string;
  note?: string;
};

export default function StatTile({ label, value, note }: Props) {
  return (
    <div className="rounded-[20px] border border-line bg-paper p-6">
      <p className="text-[12px] uppercase tracking-wide text-subtle mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {note && <p className="text-[12px] text-subtle mt-1.5 leading-snug">{note}</p>}
    </div>
  );
}
