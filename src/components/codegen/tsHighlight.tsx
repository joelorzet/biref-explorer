import type React from 'react';

// Tiny, zero-dependency TypeScript token tinter. Not a real parser:
// just enough to visually separate keywords, types, strings, and
// comments in the generated schema file.

const KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'type',
  'interface',
  'as',
  'const',
  'readonly',
  'extends',
  'namespace',
  'declare',
  'default',
  'keyof',
  'typeof',
  'infer',
  'unknown',
  'any',
  'void',
  'null',
  'true',
  'false',
  'string',
  'number',
  'boolean',
  'bigint',
  'never',
]);

const PATTERN =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([{}[\]()<>;:,.|&?=+\-*/])/g;

export function highlightTs(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  PATTERN.lastIndex = 0;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
  while ((match = PATTERN.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(line.slice(last, match.index));
    }
    const [token, comment, block, str, num, type, ident, punct] = match;
    if (comment || block) {
      parts.push(span('text-ink-dim italic', token, key++));
    } else if (str) {
      parts.push(span('text-accent', token, key++));
    } else if (num) {
      parts.push(span('text-brand-amber', token, key++));
    } else if (type) {
      parts.push(span('text-brand-cyan', token, key++));
    } else if (ident) {
      if (KEYWORDS.has(token)) {
        parts.push(span('text-brand-violet', token, key++));
      } else {
        parts.push(span('text-ink', token, key++));
      }
    } else if (punct) {
      parts.push(span('text-ink-muted', token, key++));
    } else {
      parts.push(token);
    }
    last = match.index + token.length;
  }
  if (last < line.length) {
    parts.push(line.slice(last));
  }
  return <>{parts}</>;
}

function span(cls: string, text: string, key: number) {
  return (
    <span key={key} className={cls}>
      {text}
    </span>
  );
}
