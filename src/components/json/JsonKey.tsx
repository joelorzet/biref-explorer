import { HighlightText } from './HighlightText';

interface Props {
  name: string;
  matched: boolean;
  query: string;
  highlight: boolean;
}

export function JsonKey({ name, matched, query, highlight }: Props) {
  return (
    <span
      className={`shrink-0 ${
        matched ? 'text-accent font-semibold' : 'text-brand-cyan'
      }`}
    >
      <span className="text-ink-dim">&quot;</span>
      <HighlightText text={name} query={query} active={highlight} />
      <span className="text-ink-dim">&quot;</span>
      <span className="text-ink-muted">: </span>
    </span>
  );
}
