'use client';

import type { JsonSearchState } from '@/hooks/useJsonSearch';
import { JsonCopyButton } from './JsonCopyButton';
import { JsonSearchBar } from './JsonSearchBar';

interface Props {
  value: unknown;
  search: JsonSearchState;
}

export function JsonToolbar({ value, search }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <JsonSearchBar
          query={search.query}
          mode={search.mode}
          matchCount={search.result.count}
          onQueryChange={search.setQuery}
          onModeChange={search.setMode}
        />
      </div>
      <JsonCopyButton value={value} />
    </div>
  );
}
