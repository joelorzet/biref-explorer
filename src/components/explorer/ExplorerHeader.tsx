'use client';

import type { DataModelDTO } from '@shared/api';
import { IconDatabase, IconScan, IconSpinner, IconX } from '../icons';

interface Props {
  database: string;
  model: DataModelDTO | null;
  scanning: boolean;
  onRescan: () => void;
  onDisconnect: () => void;
}

export function ExplorerHeader({
  database,
  model,
  scanning,
  onRescan,
  onDisconnect,
}: Props) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-bg-elevated/60 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/15 text-accent ring-1 ring-accent/30">
          <IconDatabase className="h-4 w-4" />
        </div>
        <div>
          <div className="font-mono text-xs text-ink">{database}</div>
          {model && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-ink-dim">
              <span>{model.stats.entityCount} entities</span>
              <span className="h-2 w-px bg-border" />
              <span>{model.stats.fieldCount} fields</span>
              <span className="h-2 w-px bg-border" />
              <span>{model.stats.relationshipCount} relations</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRescan}
          className="btn-subtle text-[11px] py-1.5"
          disabled={scanning}
        >
          {scanning ? (
            <>
              <IconSpinner className="h-3.5 w-3.5 animate-spin" /> scanning
            </>
          ) : (
            <>
              <IconScan className="h-3.5 w-3.5" /> rescan
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          className="btn-ghost text-[11px] py-1.5"
        >
          <IconX className="h-3.5 w-3.5" /> disconnect
        </button>
      </div>
    </header>
  );
}
