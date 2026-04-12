'use client';

import type { IncludeNodeDTO, QueryBody, WhereClauseDTO } from '@shared/api';
import { useState } from 'react';

export interface QueryState {
  select: string[];
  where: WhereClauseDTO[];
  includes: IncludeNodeDTO[];
  limit?: number;
  mode: QueryBody['mode'];
}

const initial = (): QueryState => ({
  select: [],
  where: [],
  includes: [],
  limit: 20,
  mode: 'findMany',
});

/**
 * Controlled query state for the builder UI. The reset-on-entity-change
 * concern is handled at the mount site via React's `key` pattern: the
 * parent re-keys QueryBuilder on entity change, which remounts this
 * hook and drops all state. So there is no effect to maintain here.
 */
export function useQueryState() {
  const [state, setState] = useState<QueryState>(initial);

  const update = (patch: Partial<QueryState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const toggleSelect = (field: string) => {
    setState((prev) => {
      const selected = new Set(prev.select);
      if (selected.has(field)) {
        selected.delete(field);
      } else {
        selected.add(field);
      }
      return { ...prev, select: [...selected] };
    });
  };

  return { state, update, toggleSelect };
}
