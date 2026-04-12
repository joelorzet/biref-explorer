import type { RelationDTO } from '@shared/api';
import { IconChevronRight } from '../icons';

interface Props {
  rel: RelationDTO;
  tone: 'accent' | 'violet';
}

export function RelationItem({ rel, tone }: Props) {
  const chipTone = tone === 'accent' ? 'chip-accent' : 'chip-violet';
  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ink">{rel.name}</span>
        <span className={chipTone}>{rel.cardinality}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-ink-dim">
        <span>
          {rel.from.namespace}.{rel.from.name}
        </span>
        <span>({rel.fromFields.join(', ')})</span>
        <IconChevronRight className="h-3 w-3" />
        <span>
          {rel.to.namespace}.{rel.to.name}
        </span>
        <span>({rel.toFields.join(', ')})</span>
      </div>
    </div>
  );
}
