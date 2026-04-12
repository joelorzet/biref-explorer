const FEATURES = [
  'Bidirectional relationship graph',
  'Fluent .include() across inbound & outbound hops',
  'Paradigm-neutral DataModel',
  'Zero runtime deps inside the scanner',
];

export function FeatureList() {
  return (
    <div className="panel p-5">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        What you get
      </div>
      <ul className="space-y-2 text-xs text-ink-muted">
        {FEATURES.map((text) => (
          <li key={text} className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
