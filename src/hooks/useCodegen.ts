'use client';

import type { CodegenResponse } from '@shared/api';
import { useCallback, useState } from 'react';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { dbScanner, notifier } from '@/lib/container/client';

export function useCodegen(sessionId: string) {
  const { data, loading, error } = useAsyncResource<CodegenResponse, string>(
    sessionId,
    (activeSessionId) =>
      notifier().codegen.run(dbScanner().codegen(activeSessionId)),
  );

  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    if (!data) {
      return;
    }
    try {
      await navigator.clipboard.writeText(data.schemaTs);
      notifier().codegen.copied();
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (clipboardError) {
      notifier().error({
        title: 'Copy failed',
        description: (clipboardError as Error).message,
      });
    }
  }, [data]);

  const onDownload = useCallback(() => {
    if (!data) {
      return;
    }
    const blob = new Blob([data.schemaTs], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'biref.schema.ts';
    anchor.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return { data, loading, error, copied, onCopy, onDownload };
}
