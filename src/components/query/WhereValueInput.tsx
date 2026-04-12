'use client';

import type { FieldDTO } from '@shared/api';

interface Props {
  field: FieldDTO | undefined;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function WhereValueInput({ field, value, onChange }: Props) {
  const category = field?.category ?? 'unknown';

  if (category === 'boolean') {
    return (
      <select
        className="input flex-1 py-1.5 text-xs"
        value={String(value ?? 'true')}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (category === 'enum' && field?.enumValues?.length) {
    return (
      <select
        className="input flex-1 py-1.5 text-xs"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          select value
        </option>
        {field.enumValues.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    );
  }

  const placeholder = placeholderFor(category);

  return (
    <input
      className="input flex-1 py-1.5 text-xs"
      type={inputTypeFor(category)}
      placeholder={placeholder}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function inputTypeFor(category: string): string {
  switch (category) {
    case 'integer':
    case 'decimal':
      return 'number';
    case 'date':
      return 'date';
    case 'timestamp':
      return 'datetime-local';
    case 'time':
      return 'time';
    default:
      return 'text';
  }
}

function placeholderFor(category: string): string {
  switch (category) {
    case 'integer':
      return '0';
    case 'decimal':
      return '0.00';
    case 'uuid':
      return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    default:
      return 'value';
  }
}
