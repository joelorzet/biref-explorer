import type { IndexDTO } from '@shared/api';
import { IconFilter } from '../icons';

interface Props {
  indexes: IndexDTO[];
}

export function IndexesList({ indexes }: Props) {
  if (indexes.length === 0) {
    return null;
  }
  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-xs font-semibold text-ink">
        <IconFilter className="h-3.5 w-3.5 text-ink-muted" /> Indexes
      </div>
      <div className="divide-y divide-border">
        {indexes.map((idx) => (
          <div
            key={idx.name}
            className="flex items-center justify-between px-5 py-2.5 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-ink">{idx.name}</span>
              {idx.unique && <span className="chip-accent">unique</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="chip font-mono">{idx.kind}</span>
              <span className="font-mono text-ink-muted">
                ({idx.fields.join(', ')})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
