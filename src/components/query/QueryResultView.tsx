'use client';

import type { QueryResponse } from '@shared/api';
import { IconX, IconZap } from '../icons';
import { QueryResultJson } from './QueryResultJson';

interface Props {
  result: QueryResponse | null;
  error: string | null;
  running: boolean;
}

export function QueryResultView({ result, error, running }: Props) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-ink">
          <IconZap className="h-3.5 w-3.5 text-accent" /> result
        </div>
        {result && (
          <div className="flex items-center gap-3 font-mono text-[11px] text-ink-dim">
            <span>
              <span className="text-ink">{result.rowCount}</span> rows
            </span>
            <span className="h-3 w-px bg-border" />
            <span>
              <span className="text-ink">{result.elapsedMs}</span>ms
            </span>
          </div>
        )}
      </div>

      {error ? (
        <div className="p-5">
          <div className="flex items-start gap-2 rounded-lg border border-brand-rose/40 bg-brand-rose/10 p-3 font-mono text-[11px] text-brand-rose">
            <IconX className="mt-0.5 h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        </div>
      ) : running ? (
        <div className="space-y-2 p-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 w-full rounded bg-bg-hover"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      ) : result ? (
        <QueryResultJson rows={result.rows} />
      ) : (
        <div className="p-5 py-6 text-center text-[11px] text-ink-dim">
          Run the query to see results
        </div>
      )}
    </div>
  );
}
