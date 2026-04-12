'use client';

import { useState } from 'react';
import { notifier } from '@/lib/container/client';
import { IconCheck, IconCopy } from '../icons';

interface Props {
  value: unknown;
}

export function JsonCopyButton({ value }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      const text = JSON.stringify(value, jsonReplacer, 2);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      notifier().success({ title: 'Copied raw JSON', duration: 2000 });
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      notifier().error({
        title: 'Copy failed',
        description: (err as Error).message,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn-subtle py-1.5 text-[11px]"
      title="Copy raw JSON to clipboard"
    >
      {copied ? (
        <>
          <IconCheck className="h-3.5 w-3.5 text-accent" /> copied
        </>
      ) : (
        <>
          <IconCopy className="h-3.5 w-3.5" /> raw JSON
        </>
      )}
    </button>
  );
}

function jsonReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}
