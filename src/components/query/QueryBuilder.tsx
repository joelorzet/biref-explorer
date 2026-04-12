'use client';

import type { DataModelDTO, EntityDTO } from '@shared/api';
import { useQueryRunner } from '@/hooks/useQueryRunner';
import { useQueryState } from '@/hooks/useQueryState';
import { IncludeList } from './IncludeList';
import { QueryResultView } from './QueryResultView';
import { QueryToolbar } from './QueryToolbar';
import { SelectChips } from './SelectChips';
import { SqlPreview } from './SqlPreview';
import { WhereList } from './WhereList';

interface Props {
  sessionId: string;
  model: DataModelDTO;
  entity: EntityDTO;
}

export function QueryBuilder({ sessionId, model, entity }: Props) {
  const { state, update, toggleSelect } = useQueryState();
  const {
    result,
    running,
    error,
    run,
    sqlResult,
    sqlLoading,
    sqlError,
    toSql,
  } = useQueryRunner({ sessionId, entity });

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="panel p-4">
        <QueryToolbar
          mode={state.mode}
          limit={state.limit}
          running={running}
          sqlLoading={sqlLoading}
          onModeChange={(m) => update({ mode: m })}
          onLimitChange={(l) => update({ limit: l })}
          onRun={() => run(state)}
          onToSql={() => toSql(state)}
        />
      </div>

      <div className="panel p-5">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          select
        </div>
        <SelectChips
          fields={entity.fields}
          selected={state.select}
          onToggle={toggleSelect}
          onSelectAll={() => update({ select: [] })}
        />
      </div>

      <div className="panel p-5">
        <WhereList
          where={state.where}
          fields={entity.fields}
          onChange={(next) => update({ where: next })}
        />
      </div>

      <div className="panel p-5">
        <IncludeList
          parent={entity}
          model={model}
          includes={state.includes}
          onChange={(next) => update({ includes: next })}
        />
      </div>

      {sqlError && (
        <div className="panel p-5 text-xs text-brand-rose">{sqlError}</div>
      )}
      {sqlResult && (
        <SqlPreview
          queries={sqlResult.queries}
          elapsedMs={sqlResult.elapsedMs}
        />
      )}

      <QueryResultView result={result} error={error} running={running} />
    </div>
  );
}
