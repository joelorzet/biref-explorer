'use client';

import type { DriverId } from '@shared/api';
import { DRIVERS } from './drivers';

interface Props {
  value: DriverId;
  onChange: (driver: DriverId) => void;
}

export function DriverSelector({ value, onChange }: Props) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        Driver
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {DRIVERS.map((driver) => {
          const active = driver.id === value;
          const disabled = !driver.available;
          return (
            <button
              key={driver.id}
              type="button"
              disabled={disabled}
              onClick={() => driver.available && onChange(driver.id)}
              className={`group relative cursor-pointer rounded-md border px-2 py-2 text-center transition-colors duration-150 ${
                active
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : disabled
                    ? 'cursor-not-allowed border-border bg-bg-elevated/40 text-ink-dim'
                    : 'border-border bg-bg-elevated text-ink-muted hover:border-border-strong hover:text-ink'
              }`}
            >
              <div className="text-xs font-semibold">{driver.label}</div>
              <div className="mt-0.5 font-mono text-[9px] text-ink-dim">
                {disabled ? 'soon' : `${driver.scheme}://`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
