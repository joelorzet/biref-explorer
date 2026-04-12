'use client';

import type { QueryBody } from '@shared/api';
import { IconCode, IconPlay, IconSpinner } from '../icons';
import { LimitInput } from './LimitInput';

interface Props {
  mode: QueryBody['mode'];
  limit: number | undefined;
  running: boolean;
  sqlLoading: boolean;
  onModeChange: (mode: QueryBody['mode']) => void;
  onLimitChange: (limit: number | undefined) => void;
  onRun: () => void;
  onToSql: () => void;
}

export function QueryToolbar({
  mode,
  limit,
  running,
  sqlLoading,
  onModeChange,
  onLimitChange,
  onRun,
  onToSql,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded-md border border-border text-[11px] font-mono">
        <button
          type="button"
          onClick={() => onModeChange('findMany')}
          className={`cursor-pointer px-2.5 py-1.5 transition-colors ${
            mode === 'findMany'
              ? 'bg-accent/15 text-accent'
              : 'text-ink-muted hover:bg-bg-hover'
          }`}
        >
          findMany
        </button>
        <button
          type="button"
          onClick={() => onModeChange('findFirst')}
          className={`cursor-pointer border-l border-border px-2.5 py-1.5 transition-colors ${
            mode === 'findFirst'
              ? 'bg-accent/15 text-accent'
              : 'text-ink-muted hover:bg-bg-hover'
          }`}
        >
          findFirst
        </button>
      </div>

      {mode === 'findMany' ? (
        <LimitInput value={limit} onChange={onLimitChange} />
      ) : (
        <span className="chip font-mono text-[10px] text-ink-dim">
          returns one row
        </span>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="btn-subtle py-1.5 text-xs"
          onClick={onToSql}
          disabled={sqlLoading}
        >
          {sqlLoading ? (
            <>
              <IconSpinner className="h-3.5 w-3.5 animate-spin" /> generating
            </>
          ) : (
            <>
              <IconCode className="h-3.5 w-3.5" /> get SQL
            </>
          )}
        </button>
        <button
          type="button"
          className="btn-primary py-1.5 text-xs"
          onClick={onRun}
          disabled={running}
        >
          {running ? (
            <>
              <IconSpinner className="h-3.5 w-3.5 animate-spin" /> running
            </>
          ) : (
            <>
              <IconPlay className="h-3.5 w-3.5" /> run query
            </>
          )}
        </button>
      </div>
    </div>
  );
}
