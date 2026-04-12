'use client';

import { IconLayers, IconX } from '../icons';

interface Props {
  value: number | undefined;
  onChange: (limit: number | undefined) => void;
}

export function LimitInput({ value, onChange }: Props) {
  const hasLimit = value !== undefined && value !== null;
  return (
    <label
      className="flex items-center gap-2 rounded-md border border-border bg-bg-elevated pl-2.5 pr-1 transition-colors focus-within:border-border-strong"
      title="Cap the number of rows returned by findMany. Empty = no limit (∞)"
    >
      <IconLayers className="h-3.5 w-3.5 text-ink-dim" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-dim">
        Limit
      </span>
      <input
        type="number"
        min={1}
        placeholder="∞"
        value={value ?? ''}
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : undefined)
        }
        className="w-14 bg-transparent py-1.5 text-center font-mono text-xs text-ink placeholder:text-ink-dim focus:outline-none"
      />
      {hasLimit ? (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-ink-dim transition-colors hover:text-ink"
          title="Clear limit: return all rows (∞)"
          aria-label="Clear limit"
        >
          <IconX className="h-3 w-3" />
        </button>
      ) : (
        <span
          className="flex h-5 w-5 items-center justify-center text-[11px] font-mono text-ink-dim"
          title="No limit set"
        >
          ∞
        </span>
      )}
    </label>
  );
}
