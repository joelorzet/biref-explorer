'use client';

import type { ExplainedQueryDTO } from '@shared/api';
import { useMemo, useState } from 'react';
import { SyntaxBlock } from '../codegen/SyntaxBlock';
import { IconCheck, IconCopy } from '../icons';

interface Props {
  queries: ExplainedQueryDTO;
  elapsedMs: number;
}

function formatQuery(q: ExplainedQueryDTO, depth = 0): string {
  const indent = '  '.repeat(depth);
  const header = depth > 0 ? `${indent}-- include: ${q.entity}\n` : '';
  const params =
    q.params.length > 0
      ? `\n${indent}-- params: [${q.params.map((p) => JSON.stringify(p)).join(', ')}]`
      : '';
  const children = q.includes
    .map((inc) => formatQuery(inc, depth + 1))
    .join('\n\n');
  const childBlock = children ? `\n\n${children}` : '';
  return `${header}${indent}${q.sql};${params}${childBlock}`;
}

export function SqlPreview({ queries, elapsedMs }: Props) {
  const [copied, setCopied] = useState(false);
  const formatted = useMemo(() => formatQuery(queries), [queries]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="panel animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-ink-muted">Generated SQL</span>
          <span className="h-3 w-px bg-border" />
          <span className="text-ink-dim">
            <span className="text-ink">{elapsedMs}</span>ms
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="btn-subtle py-1.5 text-[11px]"
        >
          {copied ? (
            <>
              <IconCheck className="h-3.5 w-3.5 text-accent" /> copied
            </>
          ) : (
            <>
              <IconCopy className="h-3.5 w-3.5" /> copy
            </>
          )}
        </button>
      </div>
      <SyntaxBlock code={formatted} />
    </div>
  );
}
