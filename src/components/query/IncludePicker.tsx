'use client';

import type { EntityDTO } from '@shared/api';
import { IconLink } from '../icons';
import { RelationMenu } from './RelationMenu';

interface Props {
  parent: EntityDTO;
  existing: Set<string>;
  onToggle: (relationName: string) => void;
  onAddAll: () => void;
}

export function IncludePicker({ parent, existing, onToggle, onAddAll }: Props) {
  if (parent.relationships.length === 0) {
    return null;
  }
  const allAdded = existing.size === parent.relationships.length;
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        <IconLink className="h-3 w-3" /> includes
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onAddAll}
          disabled={allAdded}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-bg-elevated px-2 py-1 font-mono text-[11px] text-ink-muted transition-colors duration-150 hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-muted"
          title=".include('*'): add every relation at once"
        >
          * <span className="text-ink-dim">all</span>
        </button>
        <RelationMenu parent={parent} existing={existing} onToggle={onToggle} />
      </div>
    </div>
  );
}
