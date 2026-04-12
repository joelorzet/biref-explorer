export type SearchMode = 'all' | 'key' | 'value';

export interface SearchState {
  query: string;
  mode: SearchMode;
}

export interface SearchResult {
  matches: Set<string>;
  expand: Set<string>;
  count: number;
}

export const EMPTY_RESULT: SearchResult = {
  matches: new Set(),
  expand: new Set(),
  count: 0,
};

export function computeSearch(
  value: unknown,
  state: SearchState,
): SearchResult {
  const query = state.query.trim().toLowerCase();
  if (!query) {
    return EMPTY_RESULT;
  }
  const result: SearchResult = {
    matches: new Set(),
    expand: new Set(),
    count: 0,
  };
  walk(value, '', null, query, state.mode, result);
  return result;
}

function walk(
  value: unknown,
  path: string,
  key: string | null,
  query: string,
  mode: SearchMode,
  result: SearchResult,
): boolean {
  let selfMatch = false;
  if (
    key !== null &&
    (mode === 'all' || mode === 'key') &&
    key.toLowerCase().includes(query)
  ) {
    selfMatch = true;
  }

  if (isContainer(value)) {
    const entries = containerEntries(value);
    let childMatch = false;
    for (const [k, v] of entries) {
      const childPath = Array.isArray(value)
        ? `${path}[${k}]`
        : path
          ? `${path}.${k}`
          : k;
      const childKey = Array.isArray(value) ? null : k;
      if (walk(v, childPath, childKey, query, mode, result)) {
        childMatch = true;
      }
    }
    if (selfMatch) {
      result.matches.add(path);
      result.count += 1;
    }
    if (selfMatch || childMatch) {
      result.expand.add(path);
    }
    return selfMatch || childMatch;
  }

  if (
    (mode === 'all' || mode === 'value') &&
    value !== null &&
    value !== undefined &&
    String(value).toLowerCase().includes(query)
  ) {
    selfMatch = true;
  }
  if (selfMatch) {
    result.matches.add(path);
    result.count += 1;
  }
  return selfMatch;
}

function isContainer(value: unknown): value is object {
  return (
    value !== null && typeof value === 'object' && !(value instanceof Date)
  );
}

function containerEntries(value: object): Array<[string, unknown]> {
  if (Array.isArray(value)) {
    return value.map((v, i) => [String(i), v] as [string, unknown]);
  }
  return Object.entries(value as Record<string, unknown>);
}
