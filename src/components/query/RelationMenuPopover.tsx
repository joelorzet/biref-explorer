'use client';

import type { EntityDTO } from '@shared/api';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { RelationMenuItem } from './RelationMenuItem';

interface Props {
  parent: EntityDTO;
  existing: Set<string>;
  anchor: DOMRect;
  onToggle: (relationName: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const MENU_WIDTH = 320;

/**
 * Portal-rendered relation list. Positioned via fixed coordinates
 * derived from the trigger's bounding rect so no ancestor stacking
 * context can clip or shadow it. Clicking outside the popover (and
 * outside the trigger, handled by the caller) closes it.
 */
export function RelationMenuPopover({
  parent,
  existing,
  anchor,
  onToggle,
  onClose,
  triggerRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (ref.current?.contains(target)) {
        return;
      }
      if (triggerRef.current?.contains(target)) {
        return;
      }
      onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [onClose, triggerRef]);

  const left = Math.max(
    8,
    Math.min(anchor.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8),
  );
  const top = anchor.bottom + 6;

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[100] max-h-80 w-80 overflow-auto rounded-lg border border-border-strong bg-bg-panel p-1 shadow-2xl shadow-black/60 ring-1 ring-black/20 animate-fade-in"
      style={{ top, left, width: MENU_WIDTH }}
    >
      {parent.relationships.length === 0 ? (
        <div className="px-2 py-3 text-center text-[11px] text-ink-dim">
          No relations
        </div>
      ) : (
        parent.relationships.map((relation) => (
          <RelationMenuItem
            key={relation.name}
            relation={relation}
            selected={existing.has(relation.name)}
            onToggle={() => onToggle(relation.name)}
          />
        ))
      )}
    </div>,
    document.body,
  );
}
