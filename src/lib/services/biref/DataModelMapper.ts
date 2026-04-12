import 'server-only';
import type { DataModel, Entity } from '@biref/scanner';
import type { DataModelDTO, EntityDTO } from '@shared/api';
import { buildRelationNameMap } from '@/lib/utils/relationNaming';
import type { IDataModelMapper } from './types';

/**
 * Paradigm-neutral DataModel → DTO mapper. Stateless; instantiate
 * once and reuse, or call as a utility. Kept as a class so consumers
 * can be DI-tested against a mock mapper.
 */
export class DataModelMapper implements IDataModelMapper {
  toDataModelDTO(model: DataModel): DataModelDTO {
    const entities = model.entities.map((entity) => this.toEntityDTO(entity));
    const namespaces = Array.from(
      new Set(entities.map((entity) => entity.namespace)),
    ).sort();
    const stats = entities.reduce(
      (accumulator, entity) => {
        accumulator.fieldCount += entity.fields.length;
        accumulator.relationshipCount += entity.relationships.length;
        for (const relationship of entity.relationships) {
          if (relationship.direction === 'inbound') {
            accumulator.inboundCount += 1;
          } else {
            accumulator.outboundCount += 1;
          }
        }
        return accumulator;
      },
      {
        entityCount: entities.length,
        fieldCount: 0,
        relationshipCount: 0,
        inboundCount: 0,
        outboundCount: 0,
      },
    );
    return {
      kind: (model as any).kind ?? 'relational',
      namespaces,
      entities,
      stats,
    };
  }

  private toEntityDTO(entity: Entity): EntityDTO {
    const rawRelationships = ((entity as any).relationships ?? []) as any[];
    const nameMap = buildRelationNameMap({
      namespace: entity.namespace,
      name: entity.name,
      relationships: rawRelationships,
    });
    const friendlyNameByRef = new Map<any, string>();
    for (const [friendlyName, relationship] of nameMap.entries()) {
      friendlyNameByRef.set(relationship, friendlyName);
    }
    return {
      namespace: entity.namespace,
      name: entity.name,
      identifier: [...entity.identifier],
      description: entity.description ?? null,
      fields: entity.fields.map((field) => ({
        name: field.name,
        category: field.type.category as any,
        nativeType: field.type.nativeType,
        nullable: field.nullable,
        isIdentifier: field.isIdentifier,
        defaultValue: field.defaultValue ?? null,
        description: field.description ?? null,
        enumValues: (field.type as any).enumValues,
      })),
      indexes: (entity.indexes ?? []).map((index: any) => ({
        name: index.name,
        kind: index.kind,
        fields: [...index.fields],
        unique: index.unique,
      })),
      constraints: (entity.constraints ?? []).map((constraint: any) => ({
        name: constraint.name,
        kind: constraint.kind,
        fields: [...(constraint.fields ?? [])],
      })),
      relationships: rawRelationships.map((relationship: any) => ({
        name:
          friendlyNameByRef.get(relationship) ??
          relationship.reference?.name ??
          'rel',
        direction: relationship.direction,
        cardinality: relationship.direction === 'outbound' ? 'one' : 'many',
        from: relationship.reference.fromEntity,
        to: relationship.reference.toEntity,
        fromFields: [...relationship.reference.fromFields],
        toFields: [...relationship.reference.toFields],
        onDelete: relationship.reference.onDelete ?? null,
      })),
    };
  }
}
