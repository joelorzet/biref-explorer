'use client';

import type { JsonSearchState } from '@/hooks/useJsonSearch';
import { JsonNode } from './JsonNode';

interface Props {
  value: unknown;
  search: JsonSearchState;
}

export function JsonViewer({ value, search }: Props) {
  return (
    <div className="font-mono text-[12px] leading-[1.55] text-ink">
      <JsonNode value={value} path="" depth={0} isLast search={search} />
    </div>
  );
}
