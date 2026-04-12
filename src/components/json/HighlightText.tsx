import type { ReactNode } from 'react';

interface Props {
  text: string;
  query: string;
  active?: boolean;
}

/**
 * Render `text` with every case-insensitive occurrence of `query`
 * wrapped in a <mark>. Inactive or empty queries fall through to a
 * plain text fragment with no wrappers added.
 */
export function HighlightText({ text, query, active = true }: Props) {
  if (!active || !query) {
    return <>{text}</>;
  }
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let match = lowerText.indexOf(lowerQuery);
  let key = 0;

  while (match !== -1) {
    if (match > cursor) {
      parts.push(text.slice(cursor, match));
    }
    parts.push(
      <mark
        key={`m-${key++}-${match}`}
        className="rounded-sm bg-accent/40 px-0.5 text-ink"
      >
        {text.slice(match, match + query.length)}
      </mark>,
    );
    cursor = match + query.length;
    match = lowerText.indexOf(lowerQuery, cursor);
  }
  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }
  return <>{parts}</>;
}
