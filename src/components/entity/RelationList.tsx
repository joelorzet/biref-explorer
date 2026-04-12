import type { RelationDTO } from '@shared/api';
import { IconLink } from '../icons';
import { RelationItem } from './RelationItem';

interface Props {
  title: string;
  subtitle: string;
  relations: RelationDTO[];
  tone: 'accent' | 'violet';
}

export function RelationList({ title, subtitle, relations, tone }: Props) {
  return (
    <div className="panel animate-fade-in">
      <div className="border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink">
          <IconLink className="h-3.5 w-3.5 text-ink-muted" />
          {title}
          <span className="chip font-mono">{relations.length}</span>
        </div>
        <div className="mt-0.5 text-[11px] text-ink-dim">{subtitle}</div>
      </div>
      <div className="divide-y divide-border">
        {relations.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs text-ink-dim">
            No {title.toLowerCase()} relationships
          </div>
        ) : (
          relations.map((rel) => (
            <RelationItem key={rel.name} rel={rel} tone={tone} />
          ))
        )}
      </div>
    </div>
  );
}
