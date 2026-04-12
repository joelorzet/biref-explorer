'use client';

import { useMemo } from 'react';
import { highlightTs } from './tsHighlight';

interface Props {
  code: string;
}

export function SyntaxBlock({ code }: Props) {
  const lines = useMemo(() => code.split('\n'), [code]);
  return (
    <div className="max-h-[70vh] overflow-auto bg-bg-elevated/60 font-mono text-[12px] leading-relaxed">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={`${i}-${line}`} className="align-top">
              <td className="sticky left-0 select-none border-r border-border bg-bg-elevated/60 px-3 py-0.5 text-right text-[11px] text-ink-dim">
                {i + 1}
              </td>
              <td className="px-4 py-0.5 whitespace-pre text-ink">
                {highlightTs(line)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
