'use client';

import type { ConnectBody } from '@shared/api';
import { useId } from 'react';
import type { FieldErrors } from './connectionSchema';
import { Field } from './Field';

interface Props {
  form: ConnectBody;
  errors: FieldErrors;
  onChange: <K extends keyof ConnectBody>(
    key: K,
    value: ConnectBody[K],
  ) => void;
}

export function FieldsForm({ form, errors, onChange }: Props) {
  const baseId = useId();
  const id = (suffix: string) => `${baseId}-${suffix}`;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field
        id={id('host')}
        label="Host"
        value={form.host}
        colSpan={2}
        error={errors.host}
        onChange={(v) => onChange('host', v)}
      />
      <Field
        id={id('port')}
        label="Port"
        type="number"
        value={form.port}
        error={errors.port}
        onChange={(v) => onChange('port', Number(v))}
      />
      <Field
        id={id('database')}
        label="Database"
        value={form.database}
        error={errors.database}
        onChange={(v) => onChange('database', v)}
      />
      <Field
        id={id('user')}
        label="User"
        value={form.user}
        error={errors.user}
        onChange={(v) => onChange('user', v)}
      />
      <Field
        id={id('password')}
        label="Password"
        type="password"
        value={form.password}
        error={errors.password}
        onChange={(v) => onChange('password', v)}
      />
    </div>
  );
}
