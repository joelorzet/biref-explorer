'use client';

import type { EntityDTO, QueryResponse, ToSqlResponse } from '@shared/api';
import { useCallback } from 'react';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import type { QueryState } from '@/hooks/useQueryState';
import { dbScanner, notifier } from '@/lib/container/client';

interface Args {
  sessionId: string;
  entity: EntityDTO;
}

function buildBody(sessionId: string, entity: EntityDTO, state: QueryState) {
  return {
    sessionId,
    namespace: entity.namespace,
    entity: entity.name,
    select: state.select,
    where: state.where,
    include: state.includes,
    limit: state.limit,
    mode: state.mode,
  };
}

export function useQueryRunner({ sessionId, entity }: Args) {
  const action = useAsyncAction<QueryResponse>();
  const sqlAction = useAsyncAction<ToSqlResponse>();

  const run = useCallback(
    (state: QueryState) =>
      action.run(() =>
        notifier().query.run(
          dbScanner().query(buildBody(sessionId, entity, state)),
          {
            namespace: entity.namespace,
            entity: entity.name,
          },
        ),
      ),
    [action, sessionId, entity],
  );

  const toSql = useCallback(
    (state: QueryState) =>
      sqlAction.run(() =>
        dbScanner().toSql(buildBody(sessionId, entity, state)),
      ),
    [sqlAction, sessionId, entity],
  );

  return {
    result: action.result,
    running: action.running,
    error: action.error,
    run,
    sqlResult: sqlAction.result,
    sqlLoading: sqlAction.running,
    sqlError: sqlAction.error,
    toSql,
  };
}
