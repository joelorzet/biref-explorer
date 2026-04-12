'use client';

import type { FieldDTO } from '@shared/api';
import { IconCheck } from '../icons';

interface Props {
  fields: readonly FieldDTO[];
  selected: string[];
  onToggle: (name: string) => void;
  onSelectAll: () => void;
}

export function SelectChips({
  fields,
  selected,
  onToggle,
  onSelectAll,
}: Props) {
  const set = new Set(selected);
  const allMode = set.size === 0;
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={onSelectAll}
        className={`inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors duration-150 ${
          allMode
            ? 'border-accent/60 bg-accent/15 text-accent'
            : 'border-border bg-bg-elevated text-ink-muted hover:border-border-strong hover:text-ink'
        }`}
        title="Select every field (.select('*'))"
      >
        {allMode && <IconCheck className="h-3 w-3" />}*
        <span className="text-ink-dim">all</span>
      </button>
      {fields.map((f) => {
        const active = set.has(f.name);
        return (
          <button
            key={f.name}
            type="button"
            onClick={() => onToggle(f.name)}
            className={`inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-mono transition-colors duration-150 ${
              active
                ? 'border-accent/60 bg-accent/15 text-accent'
                : allMode
                  ? 'border-border bg-bg-elevated text-ink-muted hover:border-border-strong hover:text-ink'
                  : 'border-border bg-bg-elevated text-ink-dim hover:border-border-strong hover:text-ink-muted'
            }`}
          >
            {active && <IconCheck className="h-3 w-3" />}
            {f.name}
          </button>
        );
      })}
    </div>
  );
}
