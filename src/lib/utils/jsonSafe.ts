import 'server-only';

// Walk arbitrary values and convert anything JSON.stringify can't
// handle into a safe representation. Biref / pg can hand us:
//
//   - bigint     (int8 columns)               -> decimal string
//   - Date       (timestamps)                 -> ISO 8601 string
//   - Buffer     (bytea)                      -> base64 string
//   - Uint8Array (raw binary)                 -> base64 string
//   - Map / Set                               -> plain object / array
//   - undefined                               -> null (stable JSON)
//   - Symbol, function                        -> dropped
//
// Recursion preserves key order for objects and element order for
// arrays. Circular references fall back to the string '[Circular]'.

export function toJsonSafe(value: unknown): unknown {
  return walk(value, new WeakSet());
}

function walk(value: unknown, seen: WeakSet<object>): unknown {
  if (value === null || value === undefined) {
    return value ?? null;
  }

  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return Number.isFinite(value as number) || typeof value !== 'number'
        ? value
        : null;
    case 'bigint':
      return value.toString();
    case 'symbol':
    case 'function':
      return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return value.toString('base64');
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('base64');
  }

  if (value instanceof Map) {
    const mapped: Record<string, unknown> = {};
    for (const [entryKey, entryValue] of value.entries()) {
      mapped[String(entryKey)] = walk(entryValue, seen);
    }
    return mapped;
  }

  if (value instanceof Set) {
    return Array.from(value, (member) => walk(member, seen));
  }

  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }

  if (typeof value === 'object') {
    if (seen.has(value as object)) {
      return '[Circular]';
    }
    seen.add(value as object);

    if (Array.isArray(value)) {
      return value.map((element) => walk(element, seen));
    }

    const plain: Record<string, unknown> = {};
    for (const [propertyKey, propertyValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      const converted = walk(propertyValue, seen);
      if (converted !== undefined) {
        plain[propertyKey] = converted;
      }
    }
    return plain;
  }

  return value;
}
