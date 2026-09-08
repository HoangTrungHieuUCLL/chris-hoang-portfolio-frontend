type Props = {
  questions: string[];
  limit?: number;
  label?: string;
};

export default function QuestionChips({ questions, limit, label = "This dashboard answers" }: Props) {
  const shown = limit ? questions.slice(0, limit) : questions;
  return (
    <div>
      <p className="text-[12px] uppercase tracking-wide text-subtle mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {shown.map((q) => (
          <span
            key={q}
            className="inline-flex items-center rounded-full border border-line bg-mist px-4 py-2 text-[13px] text-ink leading-none"
          >
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}
