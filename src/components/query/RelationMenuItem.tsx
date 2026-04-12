'use client';

import type { RelationDTO } from '@shared/api';
import { IconCheck } from '../icons';
import { RelationDirectionIcon } from './RelationDirectionIcon';

interface Props {
  relation: RelationDTO;
  selected: boolean;
  onToggle: () => void;
}

export function RelationMenuItem({ relation, selected, onToggle }: Props) {
  const targetName =
    relation.direction === 'outbound' ? relation.to.name : relation.from.name;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-ink-muted transition-colors duration-150 hover:bg-bg-hover hover:text-ink"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
          selected
            ? 'border-accent text-accent'
            : 'border-border text-transparent'
        }`}
      >
        <IconCheck className="h-3 w-3" />
      </span>
      <RelationDirectionIcon direction={relation.direction} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[11px]">{relation.name}</div>
        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] text-ink-dim">
          <span className="truncate">{targetName}</span>
          <span
            className={`shrink-0 uppercase ${
              relation.cardinality === 'many'
                ? 'text-brand-violet'
                : 'text-accent'
            }`}
          >
            {relation.cardinality}
          </span>
        </div>
      </div>
    </button>
  );
}
