'use client';

import type { DriverId } from '@shared/api';
import { useId } from 'react';
import { driverById } from './drivers';

interface Props {
  driver: DriverId;
  value: string;
  parseError: string | null;
  onChange: (value: string) => void;
}

export function UrlForm({ driver, value, parseError, onChange }: Props) {
  const descriptor = driverById(driver);
  const textareaId = useId();
  return (
    <div className="flex flex-col gap-2">
      <label className="label" htmlFor={textareaId}>
        Connection string
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        spellCheck={false}
        placeholder={descriptor.placeholder}
        rows={3}
        className="input resize-none leading-relaxed"
      />
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-ink-dim">
          {descriptor.scheme}://user:password@host:port/database
        </span>
        {parseError ? (
          <span className="text-brand-rose">{parseError}</span>
        ) : (
          <span className="text-ink-dim">parsed client-side</span>
        )}
      </div>
    </div>
  );
}
