interface Props {
  active: boolean;
  onClick: () => void;
  title: string;
  detail: string;
  icon: React.ReactNode;
}

export function ScanModeCard({ active, onClick, title, detail, icon }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group cursor-pointer rounded-lg border p-3 text-left transition-colors duration-200 ${
        active
          ? 'border-accent/60 bg-accent/10'
          : 'border-border bg-bg-elevated hover:border-border-strong hover:bg-bg-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
            active ? 'bg-accent/20 text-accent' : 'bg-bg-panel text-ink-muted'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div
            className={`text-xs font-semibold ${
              active ? 'text-accent' : 'text-ink'
            }`}
          >
            {title}
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-ink-muted">
            {detail}
          </div>
        </div>
      </div>
    </button>
  );
}
