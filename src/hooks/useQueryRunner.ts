'use client';

import type { EntityDTO, QueryResponse } from '@shared/api';
import { useCallback } from 'react';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import type { QueryState } from '@/hooks/useQueryState';
import { dbScanner, notifier } from '@/lib/container/client';

interface Args {
  sessionId: string;
  entity: EntityDTO;
}

export function useQueryRunner({ sessionId, entity }: Args) {
  const action = useAsyncAction<QueryResponse>();

  const run = useCallback(
    (state: QueryState) =>
      action.run(() =>
        notifier().query.run(
          dbScanner().query({
            sessionId,
            namespace: entity.namespace,
            entity: entity.name,
            select: state.select,
            where: state.where,
            include: state.includes,
            limit: state.limit,
            mode: state.mode,
          }),
          { namespace: entity.namespace, entity: entity.name },
        ),
      ),
    [action, sessionId, entity],
  );

  return {
    result: action.result,
    running: action.running,
    error: action.error,
    run,
  };
}
