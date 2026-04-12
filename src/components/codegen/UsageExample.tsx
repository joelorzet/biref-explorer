'use client';

import { useCallback, useState } from 'react';
import type { DataModelDTO } from '@shared/api';
import { buildUsageSnippet } from '@/lib/utils/buildUsageSnippet';
import { IconChevronDown, IconChevronRight, IconRefresh } from '../icons';
import { UsageEditor } from './UsageEditor';

interface Props {
  model: DataModelDTO;
  schemaTs: string;
  scannerDts: string;
}

export function UsageExample({ model, schemaTs, scannerDts }: Props) {
  const [snippet, setSnippet] = useState<string | null>(() =>
    buildUsageSnippet(model),
  );

  const toggle = useCallback(() => {
    setSnippet((prev) => (prev ? null : buildUsageSnippet(model)));
  }, [model]);

  const regenerate = useCallback(() => {
    setSnippet(buildUsageSnippet(model));
  }, [model]);

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 font-mono text-[11px] text-ink-muted transition-colors hover:text-ink"
        >
          {snippet ? (
            <IconChevronDown className="h-3.5 w-3.5" />
          ) : (
            <IconChevronRight className="h-3.5 w-3.5" />
          )}
          Usage example (TypeScript)
        </button>
        {snippet && (
          <button
            type="button"
            onClick={regenerate}
            className="btn-subtle py-1.5 text-[11px]"
          >
            <IconRefresh className="h-3.5 w-3.5" /> regenerate
          </button>
        )}
      </div>
      {snippet && (
        <div className="min-h-0 flex-1">
          <UsageEditor
            value={snippet}
            schemaTs={schemaTs}
            scannerDts={scannerDts}
            onChange={setSnippet}
          />
        </div>
      )}
    </div>
  );
}
