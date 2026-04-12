import { HighlightText } from './HighlightText';

interface Props {
  value: unknown;
  query?: string;
  highlight?: boolean;
}

export function JsonValue({ value, query = '', highlight = false }: Props) {
  if (value === null) {
    return <span className="text-ink-dim">null</span>;
  }
  if (value === undefined) {
    return <span className="text-ink-dim">undefined</span>;
  }
  if (typeof value === 'string') {
    return (
      <span className="text-accent">
        &quot;
        <HighlightText text={value} query={query} active={highlight} />
        &quot;
      </span>
    );
  }
  if (typeof value === 'number') {
    return (
      <span className="text-brand-amber">
        <HighlightText text={String(value)} query={query} active={highlight} />
      </span>
    );
  }
  if (typeof value === 'bigint') {
    return (
      <span className="text-brand-amber">
        <HighlightText
          text={`${value.toString()}n`}
          query={query}
          active={highlight}
        />
      </span>
    );
  }
  if (typeof value === 'boolean') {
    return <span className="text-brand-violet">{String(value)}</span>;
  }
  if (value instanceof Date) {
    return (
      <span className="text-brand-cyan">
        &quot;
        <HighlightText
          text={value.toISOString()}
          query={query}
          active={highlight}
        />
        &quot;
      </span>
    );
  }
  return <span className="text-ink">{String(value)}</span>;
}
