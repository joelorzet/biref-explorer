'use client';

import { useEffect, useState } from 'react';
import type { JsonSearchState } from '@/hooks/useJsonSearch';
import { IconChevronDown, IconChevronRight } from '../icons';
import { JsonKey } from './JsonKey';
import { JsonValue } from './JsonValue';
import { countOf, entriesOf, kindOf, previewOf } from './jsonUtils';

interface Props {
  name?: string;
  path: string;
  value: unknown;
  depth: number;
  isArrayItem?: boolean;
  isLast?: boolean;
  search: JsonSearchState;
}

export function JsonNode({
  name,
  path,
  value,
  depth,
  isArrayItem = false,
  isLast = true,
  search,
}: Props) {
  const kind = kindOf(value);
  const matched = search.result.matches.has(path);
  const forceOpen = search.result.expand.has(path);
  const [manualOpen, setManualOpen] = useState(depth < 2);

  // When a search forces this node open, sync the local state so
  // clearing the query leaves it in the same position the user last
  // toggled to.
  useEffect(() => {
    if (forceOpen) {
      setManualOpen(true);
    }
  }, [forceOpen]);

  const open = forceOpen || manualOpen;
  const highlightKeys = search.mode === 'all' || search.mode === 'key';
  const highlightValues = search.mode === 'all' || search.mode === 'value';

  if (kind === 'primitive') {
    return (
      <div
        className={`flex items-baseline gap-1.5 py-0.5 ${
          matched ? 'rounded bg-accent/15 px-1 -mx-1' : ''
        }`}
      >
        {name !== undefined && (
          <JsonKey
            name={name}
            matched={matched}
            query={search.query}
            highlight={highlightKeys}
          />
        )}
        {isArrayItem && (
          <span className="text-ink-dim">
            {path.match(/\[(\d+)\]$/)?.[1]}:{' '}
          </span>
        )}
        <JsonValue
          value={value}
          query={search.query}
          highlight={highlightValues}
        />
        {!isLast && <span className="text-ink-dim">,</span>}
      </div>
    );
  }

  const entries = entriesOf(value);
  const isArray = kind === 'array';
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  const empty = countOf(value) === 0;

  return (
    <div className="py-0.5">
      <button
        type="button"
        onClick={() => !empty && setManualOpen((o) => !o)}
        className={`group flex items-baseline gap-1 text-left ${
          empty ? 'cursor-default' : 'cursor-pointer'
        } ${matched ? 'rounded bg-accent/15 px-1 -mx-1' : ''}`}
      >
        {!empty && (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center text-ink-dim group-hover:text-ink">
            {open ? (
              <IconChevronDown className="h-3 w-3" />
            ) : (
              <IconChevronRight className="h-3 w-3" />
            )}
          </span>
        )}
        {name !== undefined && (
          <JsonKey
            name={name}
            matched={matched}
            query={search.query}
            highlight={highlightKeys}
          />
        )}
        <span className="text-ink-muted">{openBracket}</span>
        {!open && !empty && (
          <span className="ml-1 font-mono text-[10px] text-ink-dim">
            {previewOf(value)}
          </span>
        )}
        {(!open || empty) && (
          <span className="text-ink-muted">{closeBracket}</span>
        )}
        {(!open || empty) && !isLast && <span className="text-ink-dim">,</span>}
      </button>
      {open && !empty && (
        <div className="ml-4 border-l border-border/60 pl-3">
          {entries.map(([key, child], i) => {
            const childPath = isArray
              ? `${path}[${key}]`
              : path
                ? `${path}.${key}`
                : key;
            return (
              <JsonNode
                key={key}
                name={isArray ? undefined : key}
                path={childPath}
                value={child}
                depth={depth + 1}
                isArrayItem={isArray}
                isLast={i === entries.length - 1}
                search={search}
              />
            );
          })}
        </div>
      )}
      {open && !empty && (
        <div className="text-ink-muted">
          {closeBracket}
          {!isLast && <span className="text-ink-dim">,</span>}
        </div>
      )}
    </div>
  );
}
