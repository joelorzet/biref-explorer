// Mirror of @biref/scanner's internal relation naming logic so the DTO
// names round-trip through ChainBuilder.include(...). Keep in sync with
// src/query/relationNaming.ts in the @biref/scanner package.

interface EntityRef {
  namespace: string;
  name: string;
}

interface Reference {
  name: string;
  fromEntity: EntityRef;
  toEntity: EntityRef;
  fromFields: readonly string[];
  toFields: readonly string[];
  onDelete?: string | null;
}

export interface Relationship {
  direction: 'inbound' | 'outbound';
  reference: Reference;
}

export interface EntityLike {
  namespace: string;
  name: string;
  relationships: readonly Relationship[];
}

export function buildRelationNameMap(
  entity: EntityLike,
): ReadonlyMap<string, Relationship> {
  const result = new Map<string, Relationship>();
  const used = new Set<string>();
  const proposals: Array<{ rel: Relationship; name: string; order: number }> =
    [];

  entity.relationships.forEach((rel, order) => {
    const other =
      rel.direction === 'outbound'
        ? rel.reference.toEntity
        : rel.reference.fromEntity;
    const isSelfRef =
      other.namespace === entity.namespace && other.name === entity.name;

    let name: string;
    if (isSelfRef) {
      name = rel.direction === 'outbound' ? 'parent' : 'children';
    } else if (rel.direction === 'outbound') {
      name = nameFromColumns(rel.reference.fromFields) ?? other.name;
    } else {
      name = other.name;
    }
    proposals.push({ rel, name, order });
  });

  proposals.sort((a, b) => {
    if (a.rel.direction !== b.rel.direction) {
      return a.rel.direction === 'outbound' ? -1 : 1;
    }
    return a.order - b.order;
  });

  for (const { rel, name } of proposals) {
    let final = name;
    if (used.has(final)) {
      final = disambiguate(rel, name, used);
    }
    used.add(final);
    result.set(final, rel);
  }

  return result;
}

function nameFromColumns(columns: readonly string[]): string | null {
  if (columns.length === 0) {
    return null;
  }
  const pieces = columns
    .map(stripIdSuffix)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0 && piece.toLowerCase() !== 'id');
  if (pieces.length === 0) {
    return null;
  }
  return pieces.join('_');
}

function stripIdSuffix(column: string): string {
  const underscore = column.match(/^(.*)_id$/i);
  if (underscore?.[1] !== undefined) {
    return underscore[1];
  }
  const camel = column.match(/^(.*)Id$/);
  if (camel?.[1] !== undefined) {
    return camel[1];
  }
  return column;
}

function disambiguate(
  rel: Relationship,
  base: string,
  used: ReadonlySet<string>,
): string {
  if (rel.direction === 'inbound') {
    const suffix = nameFromColumns(rel.reference.fromFields);
    if (suffix) {
      const candidate = `${base}_by_${suffix}`;
      if (!used.has(candidate)) {
        return candidate;
      }
    }
  } else {
    const targetName = rel.reference.toEntity.name;
    if (targetName) {
      const candidate = `${base}_${targetName}`;
      if (!used.has(candidate)) {
        return candidate;
      }
    }
  }
  let candidate = rel.reference.name;
  if (!used.has(candidate)) {
    return candidate;
  }
  let counter = 2;
  while (used.has(candidate)) {
    candidate = `${rel.reference.name}_${counter}`;
    counter += 1;
  }
  return candidate;
}
