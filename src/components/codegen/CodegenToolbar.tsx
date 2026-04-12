'use client';

import { IconCheck, IconCopy, IconDownload } from '../icons';

interface Props {
  entityCount: number;
  elapsedMs: number;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function CodegenToolbar({
  entityCount,
  elapsedMs,
  copied,
  onCopy,
  onDownload,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-3">
      <div className="flex items-center gap-3 font-mono text-[11px]">
        <span className="text-ink-muted">biref.schema.ts</span>
        <span className="h-3 w-px bg-border" />
        <span className="text-ink-dim">
          <span className="text-ink">{entityCount}</span> entities
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="text-ink-dim">
          <span className="text-ink">{elapsedMs}</span>ms
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="btn-subtle py-1.5 text-[11px]"
        >
          {copied ? (
            <>
              <IconCheck className="h-3.5 w-3.5 text-accent" /> copied
            </>
          ) : (
            <>
              <IconCopy className="h-3.5 w-3.5" /> copy
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="btn-subtle py-1.5 text-[11px]"
        >
          <IconDownload className="h-3.5 w-3.5" /> download
        </button>
      </div>
    </div>
  );
}
