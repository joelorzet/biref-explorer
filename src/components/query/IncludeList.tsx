'use client';

import type { DataModelDTO, EntityDTO, IncludeNodeDTO } from '@shared/api';
import { useArrayState } from '@/hooks/useArrayState';
import { useToggleSet } from '@/hooks/useToggleSet';
import { IncludeCard } from './IncludeCard';
import { IncludePicker } from './IncludePicker';
import { newIncludeFor } from './includeState';

interface Props {
  parent: EntityDTO;
  model: DataModelDTO;
  includes: IncludeNodeDTO[];
  onChange: (next: IncludeNodeDTO[]) => void;
}

export function IncludeList({ parent, model, includes, onChange }: Props) {
  const { append, extend, updateAt, removeAt } = useArrayState(
    includes,
    onChange,
  );

  // Set of relation names that are currently collapsed. Default is
  // "not in set" = open. `addAll` bulk-inserts so nothing overwhelms
  // the view; `add` (single) leaves the new card open.
  const collapsed = useToggleSet<string>();

  const existing = new Set(includes.map((include) => include.relation));

  const toggle = (relationName: string) => {
    const index = includes.findIndex(
      (include) => include.relation === relationName,
    );
    if (index >= 0) {
      collapsed.remove(relationName);
      removeAt(index);
      return;
    }
    collapsed.remove(relationName);
    append(newIncludeFor(relationName));
  };

  const addAll = () => {
    const toAdd = parent.relationships
      .filter((relationship) => !existing.has(relationship.name))
      .map((relationship) => {
        collapsed.add(relationship.name);
        return newIncludeFor(relationship.name);
      });
    extend(toAdd);
  };

  const removeInclude = (index: number, relationName: string) => {
    collapsed.remove(relationName);
    removeAt(index);
  };

  return (
    <div>
      <IncludePicker
        parent={parent}
        existing={existing}
        onToggle={toggle}
        onAddAll={addAll}
      />
      {includes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-elevated/40 px-3 py-3 text-center text-[11px] text-ink-dim">
          No includes: only this entity&apos;s own columns
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {includes.map((node, index) => (
            <IncludeCard
              key={`${node.relation}-${index}`}
              parent={parent}
              model={model}
              node={node}
              collapsed={collapsed.has(node.relation)}
              onChange={(next) => updateAt(index, next)}
              onRemove={() => removeInclude(index, node.relation)}
              onToggleCollapse={() => collapsed.toggle(node.relation)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
