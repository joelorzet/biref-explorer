'use client';

import type { DataModelDTO, EntityDTO } from '@shared/api';
import { CodegenView } from '../codegen/CodegenView';
import { EntityDetail } from '../EntityDetail';
import { QueryBuilder } from '../query/QueryBuilder';
import { ExplorerEmptyState } from './ExplorerEmptyState';
import type { ExplorerTab } from './TabSwitcher';

interface Props {
  tab: ExplorerTab;
  sessionId: string;
  model: DataModelDTO;
  entity: EntityDTO | null;
}

export function ExplorerContent({ tab, sessionId, model, entity }: Props) {
  if (tab === 'codegen') {
    return <CodegenView sessionId={sessionId} model={model} />;
  }
  if (!entity) {
    return <ExplorerEmptyState />;
  }
  if (tab === 'query') {
    // Key by entity so switching tables remounts the builder and
    // drops all select/where/include state. No manual reset needed.
    const entityKey = `${entity.namespace}.${entity.name}`;
    return (
      <QueryBuilder
        key={entityKey}
        sessionId={sessionId}
        model={model}
        entity={entity}
      />
    );
  }
  return <EntityDetail entity={entity} />;
}
