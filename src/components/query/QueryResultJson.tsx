'use client';

import { useJsonSearch } from '@/hooks/useJsonSearch';
import { JsonToolbar } from '../json/JsonToolbar';
import { JsonViewer } from '../json/JsonViewer';

interface Props {
  rows: unknown;
}

export function QueryResultJson({ rows }: Props) {
  const search = useJsonSearch(rows);
  return (
    <div className="flex flex-col">
      <div className="border-b border-border px-5 py-3">
        <JsonToolbar value={rows} search={search} />
      </div>
      <div className="max-h-[560px] overflow-auto p-5">
        <JsonViewer value={rows} search={search} />
      </div>
    </div>
  );
}
