export type JsonKind = 'object' | 'array' | 'primitive';

export function kindOf(value: unknown): JsonKind {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    return 'object';
  }
  return 'primitive';
}

export function entriesOf(value: unknown): Array<[string, unknown]> {
  if (Array.isArray(value)) {
    return value.map((v, i) => [String(i), v] as [string, unknown]);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>);
  }
  return [];
}

export function countOf(value: unknown): number {
  if (Array.isArray(value)) {
    return value.length;
  }
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length;
  }
  return 0;
}

export function previewOf(value: unknown): string {
  const kind = kindOf(value);
  const count = countOf(value);
  if (kind === 'array') {
    return `[ ${count} ${count === 1 ? 'item' : 'items'} ]`;
  }
  if (kind === 'object') {
    return `{ ${count} ${count === 1 ? 'field' : 'fields'} }`;
  }
  return '';
}
