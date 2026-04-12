'use client';

import type { EntityDTO } from '@shared/api';
import { useRef, useState } from 'react';
import { useAnchoredRect } from '@/hooks/useAnchoredRect';
import { IconChevronDown, IconLink } from '../icons';
import { RelationMenuPopover } from './RelationMenuPopover';

interface Props {
  parent: EntityDTO;
  existing: Set<string>;
  onToggle: (relationName: string) => void;
}

/**
 * Toggleable trigger for the relation picker. The list itself lives
 * in a portal (RelationMenuPopover) so no ancestor stacking context
 * can clip or shadow it. Opening never pushes card content since the
 * popover is position: fixed on the document.
 */
export function RelationMenu({ parent, existing, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchor = useAnchoredRect(triggerRef, open);
  const relations = parent.relationships;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-md border bg-bg-elevated px-2.5 py-1 text-[11px] font-mono transition-colors ${
          open
            ? 'border-accent/60 text-accent'
            : 'border-border text-ink-muted hover:border-border-strong hover:text-ink'
        }`}
      >
        <IconLink className="h-3 w-3" />
        relations
        <span className="text-ink-dim">
          {existing.size}/{relations.length}
        </span>
        <IconChevronDown
          className={`h-3 w-3 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && anchor && (
        <RelationMenuPopover
          parent={parent}
          existing={existing}
          anchor={anchor}
          triggerRef={triggerRef}
          onToggle={onToggle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
