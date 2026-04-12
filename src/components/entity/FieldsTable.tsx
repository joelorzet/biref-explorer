'use client';

import type { EntityDTO } from '@shared/api';
import { useTextFilter } from '@/hooks/useTextFilter';
import { IconLayers, IconSearch } from '../icons';
import { FieldRow } from './FieldRow';

interface Props {
  entity: EntityDTO;
}

export function FieldsTable({ entity }: Props) {
  const { query, setQuery, filtered } = useTextFilter(
    entity.fields,
    (field) => `${field.name} ${field.nativeType}`,
  );

  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink">
          <IconLayers className="h-3.5 w-3.5 text-ink-muted" />
          Columns
          <span className="chip font-mono">{filtered.length}</span>
        </div>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-dim" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter columns"
            className="input w-56 pl-8 py-1.5 text-xs"
          />
        </div>
      </div>
      <div className="divide-y divide-border">
        {filtered.map((field) => (
          <FieldRow key={field.name} field={field} />
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-xs text-ink-dim">
            No columns match
          </div>
        )}
      </div>
    </div>
  );
}
