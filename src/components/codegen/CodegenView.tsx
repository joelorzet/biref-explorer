'use client';

import type { DataModelDTO } from '@shared/api';
import { useCodegen } from '@/hooks/useCodegen';
import { IconSpinner, IconX } from '../icons';
import { CodegenToolbar } from './CodegenToolbar';
import { SyntaxBlock } from './SyntaxBlock';
import { UsageExample } from './UsageExample';

interface Props {
  sessionId: string;
  model: DataModelDTO;
}

export function CodegenView({ sessionId, model }: Props) {
  const { data, loading, error, copied, onCopy, onDownload } =
    useCodegen(sessionId);

  if (error) {
    return (
      <div className="panel flex items-center gap-2 p-5 text-xs text-brand-rose">
        <IconX className="h-4 w-4" /> {error}
      </div>
    );
  }
  if (loading || !data) {
    return (
      <div className="panel flex items-center gap-2 p-5 text-xs text-ink-muted">
        <IconSpinner className="h-4 w-4 animate-spin" /> Generating schema…
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-in h-full">
      <div className="panel w-1/2 min-w-0 overflow-hidden">
        <CodegenToolbar
          entityCount={data.entityCount}
          elapsedMs={data.elapsedMs}
          copied={copied}
          onCopy={onCopy}
          onDownload={onDownload}
        />
        <SyntaxBlock code={data.schemaTs} />
      </div>
      <div className="w-1/2 min-w-0">
        <UsageExample
          model={model}
          schemaTs={data.schemaTs}
          scannerDts={data.scannerDts}
        />
      </div>
    </div>
  );
}
