'use client';

import { useCodegen } from '@/hooks/useCodegen';
import { IconSpinner, IconX } from '../icons';
import { CodegenToolbar } from './CodegenToolbar';
import { SyntaxBlock } from './SyntaxBlock';

interface Props {
  sessionId: string;
}

export function CodegenView({ sessionId }: Props) {
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
    <div className="panel animate-fade-in overflow-hidden">
      <CodegenToolbar
        entityCount={data.entityCount}
        elapsedMs={data.elapsedMs}
        copied={copied}
        onCopy={onCopy}
        onDownload={onDownload}
      />
      <SyntaxBlock code={data.schemaTs} />
    </div>
  );
}
