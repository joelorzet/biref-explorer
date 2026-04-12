'use client';

import type { EntityDTO } from '@shared/api';
import { EntityHeader } from './entity/EntityHeader';
import { FieldsTable } from './entity/FieldsTable';
import { IndexesList } from './entity/IndexesList';
import { RelationList } from './entity/RelationList';

interface Props {
  entity: EntityDTO;
}

export function EntityDetail({ entity }: Props) {
  const outbound = entity.relationships.filter(
    (relationship) => relationship.direction === 'outbound',
  );
  const inbound = entity.relationships.filter(
    (relationship) => relationship.direction === 'inbound',
  );

  return (
    <div className="flex flex-col gap-6">
      <EntityHeader entity={entity} />
      <FieldsTable entity={entity} />
      <div className="grid gap-6 md:grid-cols-2">
        <RelationList
          title="Outbound"
          subtitle="This table holds the FK"
          relations={outbound}
          tone="accent"
        />
        <RelationList
          title="Inbound"
          subtitle="Other tables point here"
          relations={inbound}
          tone="violet"
        />
      </div>
      <IndexesList indexes={entity.indexes} />
    </div>
  );
}
