'use client';

import { IconSearch, IconX } from '../icons';
import type { SearchMode } from './jsonSearch';

interface Props {
  query: string;
  mode: SearchMode;
  matchCount: number;
  onQueryChange: (query: string) => void;
  onModeChange: (mode: SearchMode) => void;
}

const MODES: Array<{ id: SearchMode; label: string }> = [
  { id: 'all', label: 'all' },
  { id: 'key', label: 'key' },
  { id: 'value', label: 'value' },
];

export function JsonSearchBar({
  query,
  mode,
  matchCount,
  onQueryChange,
  onModeChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-dim" />
        <input
          className="input w-full py-1.5 pl-8 pr-16 text-xs"
          placeholder="Find in results…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {query && (
          <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <span className="font-mono text-[10px] text-ink-dim">
              {matchCount}
            </span>
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-ink-dim hover:text-ink"
              aria-label="Clear search"
            >
              <IconX className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <div className="flex overflow-hidden rounded-md border border-border text-[10px] font-mono">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={`cursor-pointer border-border px-2 py-1.5 transition-colors [&:not(:first-child)]:border-l ${
              mode === m.id
                ? 'bg-accent/15 text-accent'
                : 'text-ink-muted hover:bg-bg-hover'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
