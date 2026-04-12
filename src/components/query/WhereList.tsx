'use client';

import type { FieldDTO, WhereClauseDTO } from '@shared/api';
import { useArrayState } from '@/hooks/useArrayState';
import { IconFilter, IconPlus } from '../icons';
import { WhereRow } from './WhereRow';

interface Props {
  where: WhereClauseDTO[];
  fields: readonly FieldDTO[];
  onChange: (next: WhereClauseDTO[]) => void;
}

export function WhereList({ where, fields, onChange }: Props) {
  const { append, updateAt, removeAt } = useArrayState(where, onChange);

  const addClause = () => {
    if (fields.length === 0) {
      return;
    }
    append({ field: fields[0]?.name, op: 'eq', value: '' });
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          <IconFilter className="h-3 w-3" /> where
        </span>
        <button
          type="button"
          onClick={addClause}
          className="btn-subtle text-[11px] py-1 px-2"
        >
          <IconPlus className="h-3 w-3" /> clause
        </button>
      </div>
      {where.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-elevated/40 px-3 py-3 text-center text-[11px] text-ink-dim">
          No filters: returns all rows
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {where.map((clause, i) => (
            <WhereRow
              key={`${i}-${clause.field}-${clause.op}`}
              clause={clause}
              fields={fields}
              onChange={(next) => updateAt(i, next)}
              onRemove={() => removeAt(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
