'use client';

import { IconCode, IconScan } from '../icons';
import { ScanModeCard } from './ScanModeCard';

export type ScanMode = 'runtime' | 'codegen';

interface Props {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
}

export function ScanModeSelector({ mode, onChange }: Props) {
  return (
    <div className="panel p-5">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        Scan mode
      </div>
      <div className="flex flex-col gap-2">
        <ScanModeCard
          active={mode === 'runtime'}
          onClick={() => onChange('runtime')}
          title="Runtime scanner"
          detail="Walks the live graph on every session. No files, nothing to commit. The query builder uses the fresh DataModel."
          icon={<IconScan className="h-4 w-4" />}
        />
        <ScanModeCard
          active={mode === 'codegen'}
          onClick={() => onChange('codegen')}
          title="Codegen"
          detail="Emits biref.schema.ts. Import BirefSchema and every .select / .where / .include gets full editor autocomplete."
          icon={<IconCode className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
