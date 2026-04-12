'use client';

import { IconCheck, IconKey } from '../icons';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Toggle for enabling SSL on the current connection. Applies in both
 * URL and Fields modes; its value always wins over anything parsed
 * out of a pasted connection string.
 */
export function SslToggle({ value, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-bg-elevated px-3 py-2.5 text-left transition-colors duration-150 ${
        value
          ? 'border-accent/60 text-accent'
          : 'border-border text-ink-muted hover:border-border-strong hover:text-ink'
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
          value ? 'bg-accent/20 text-accent' : 'bg-bg-panel text-ink-dim'
        }`}
      >
        <IconKey className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold">Enable SSL</div>
        <div className="mt-0.5 text-[10px] font-mono text-ink-dim">
          Required for secure connections.
        </div>
      </div>
      <div
        className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 ${
          value ? 'bg-accent/80' : 'bg-border-strong'
        }`}
      >
        <div
          className={`absolute flex h-4 w-4 items-center justify-center rounded-full bg-bg-panel transition-transform duration-150 ${
            value ? 'translate-x-[1.15rem]' : 'translate-x-[0.15rem]'
          }`}
        >
          {value && <IconCheck className="h-2.5 w-2.5 text-accent" />}
        </div>
      </div>
    </button>
  );
}
