'use client';

import type { FieldDTO, WhereClauseDTO } from '@shared/api';
import { useMemo } from 'react';
import { IconX } from '../icons';
import { isUnary, OPERATOR_LABEL, operatorsForCategory } from './types';
import { WhereValueInput } from './WhereValueInput';

interface Props {
  clause: WhereClauseDTO;
  fields: readonly FieldDTO[];
  onChange: (next: WhereClauseDTO) => void;
  onRemove: () => void;
}

export function WhereRow({ clause, fields, onChange, onRemove }: Props) {
  const field = useMemo(
    () => fields.find((f) => f.name === clause.field),
    [fields, clause.field],
  );

  const ops = useMemo(
    () => operatorsForCategory(field?.category ?? 'unknown'),
    [field?.category],
  );

  return (
    <div className="flex items-center gap-2">
      <select
        className="input w-40 py-1.5 text-xs"
        value={clause.field}
        onChange={(e) => onChange({ ...clause, field: e.target.value })}
      >
        {fields.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name}
          </option>
        ))}
      </select>
      <select
        className="input w-28 py-1.5 text-xs"
        value={clause.op}
        onChange={(e) =>
          onChange({ ...clause, op: e.target.value as WhereClauseDTO['op'] })
        }
      >
        {ops.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABEL[op]}
          </option>
        ))}
      </select>
      {!isUnary(clause.op) && (
        <WhereValueInput
          field={field}
          value={clause.value}
          onChange={(v) => onChange({ ...clause, value: v })}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-bg-elevated text-ink-dim transition-colors hover:border-brand-rose/40 hover:text-brand-rose"
      >
        <IconX className="h-3 w-3" />
      </button>
    </div>
  );
}
