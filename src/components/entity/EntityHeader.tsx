import type { EntityDTO } from '@shared/api';
import { IconKey, IconTable } from '../icons';

interface Props {
  entity: EntityDTO;
}

export function EntityHeader({ entity }: Props) {
  return (
    <div className="panel p-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-dim">
            <IconTable className="h-3 w-3" />
            {entity.namespace}
          </div>
          <h2 className="mt-1 font-mono text-2xl font-semibold text-ink">
            {entity.name}
          </h2>
          {entity.description && (
            <p className="mt-2 max-w-2xl text-xs text-ink-muted">
              {entity.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <Stat label="fields" value={entity.fields.length} />
          <Stat label="relations" value={entity.relationships.length} />
          <Stat label="indexes" value={entity.indexes.length} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {entity.identifier.map((col) => (
          <span key={col} className="chip-accent">
            <IconKey className="h-3 w-3" /> {col}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5 font-mono text-[11px] text-ink-dim">
      <span className="text-sm text-ink">{value}</span>
      <span>{label}</span>
    </div>
  );
}
