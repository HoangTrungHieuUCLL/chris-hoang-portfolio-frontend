"use client";

type Tab = { key: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
};

export default function TabBar({ tabs, active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 border-b border-line overflow-x-auto no-scrollbar" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`relative shrink-0 px-4 py-3 text-[14px] font-medium whitespace-nowrap transition-colors ${
              isActive ? "text-ink" : "text-subtle hover:text-ink"
            }`}
          >
            {tab.label}
            {isActive && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
