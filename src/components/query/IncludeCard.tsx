'use client';

import type { DataModelDTO, EntityDTO, IncludeNodeDTO } from '@shared/api';
import { IconChevronDown, IconChevronRight, IconX } from '../icons';
import { IncludeList } from './IncludeList';
import { relationByName, targetEntityOf } from './includeState';
import { RelationDirectionIcon } from './RelationDirectionIcon';
import { SelectChips } from './SelectChips';
import { WhereList } from './WhereList';

interface Props {
  parent: EntityDTO;
  model: DataModelDTO;
  node: IncludeNodeDTO;
  collapsed: boolean;
  onChange: (next: IncludeNodeDTO) => void;
  onRemove: () => void;
  onToggleCollapse: () => void;
}

export function IncludeCard({
  parent,
  model,
  node,
  collapsed,
  onChange,
  onRemove,
  onToggleCollapse,
}: Props) {
  const relationship = relationByName(parent, node.relation);
  const target = targetEntityOf(model, parent, node.relation);
  if (!relationship || !target) {
    return null;
  }

  const selectedSet = new Set(node.select ?? []);
  const toggleSelect = (fieldName: string) => {
    const next = new Set(selectedSet);
    if (next.has(fieldName)) {
      next.delete(fieldName);
    } else {
      next.add(fieldName);
    }
    onChange({ ...node, select: [...next] });
  };

  const childCount =
    (node.select?.length ?? 0) +
    (node.where?.length ?? 0) +
    (node.include?.length ?? 0);

  return (
    <div className="rounded-lg border border-border bg-bg-elevated/70 p-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center text-ink-dim hover:text-ink">
            {collapsed ? (
              <IconChevronRight className="h-3 w-3" />
            ) : (
              <IconChevronDown className="h-3 w-3" />
            )}
          </span>
          <RelationDirectionIcon direction={relationship.direction} />
          <span className="truncate font-mono text-xs text-ink">
            {node.relation}
          </span>
          <span className="chip font-mono text-[10px]">
            {target.namespace}.{target.name}
          </span>
          <span
            className={
              relationship.cardinality === 'many'
                ? 'chip-violet'
                : 'chip-accent'
            }
          >
            {relationship.cardinality}
          </span>
          {collapsed && childCount > 0 && (
            <span className="ml-1 font-mono text-[10px] text-ink-dim">
              {childCount} set
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border text-ink-dim hover:border-brand-rose/40 hover:text-brand-rose"
          aria-label={`Remove ${node.relation}`}
        >
          <IconX className="h-3 w-3" />
        </button>
      </div>

      {!collapsed && (
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-dim">
              select
            </div>
            <SelectChips
              fields={target.fields}
              selected={node.select ?? []}
              onToggle={toggleSelect}
              onSelectAll={() => onChange({ ...node, select: [] })}
            />
          </div>

          <WhereList
            where={node.where ?? []}
            fields={target.fields}
            onChange={(next) => onChange({ ...node, where: next })}
          />

          <IncludeList
            parent={target}
            model={model}
            includes={node.include ?? []}
            onChange={(next) => onChange({ ...node, include: next })}
          />
        </div>
      )}
    </div>
  );
}
