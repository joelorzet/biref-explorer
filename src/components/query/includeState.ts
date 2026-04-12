import type {
  DataModelDTO,
  EntityDTO,
  IncludeNodeDTO,
  RelationDTO,
} from '@shared/api';

export function findEntity(
  model: DataModelDTO,
  namespace: string,
  name: string,
): EntityDTO | undefined {
  return model.entities.find(
    (e) => e.namespace === namespace && e.name === name,
  );
}

export function targetEntityOf(
  model: DataModelDTO,
  parent: EntityDTO,
  relationName: string,
): EntityDTO | undefined {
  const rel = parent.relationships.find((r) => r.name === relationName);
  if (!rel) {
    return undefined;
  }
  const target = rel.direction === 'outbound' ? rel.to : rel.from;
  return findEntity(model, target.namespace, target.name);
}

export function relationByName(
  parent: EntityDTO,
  name: string,
): RelationDTO | undefined {
  return parent.relationships.find((r) => r.name === name);
}

export function newIncludeFor(relationName: string): IncludeNodeDTO {
  return { relation: relationName, select: [], where: [], include: [] };
}
