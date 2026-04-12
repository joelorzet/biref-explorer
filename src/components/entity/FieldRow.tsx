import type { FieldDTO } from '@shared/api';
import { IconKey } from '../icons';
import { fieldCategoryStyle } from './fieldCategoryStyle';

export function FieldRow({ field }: { field: FieldDTO }) {
  const chipClass = fieldCategoryStyle[field.category] ?? 'chip';
  return (
    <div className="group flex items-center gap-4 px-5 py-2.5 transition-colors duration-150 hover:bg-bg-hover/60">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {field.isIdentifier ? (
          <IconKey className="h-3 w-3 shrink-0 text-accent" />
        ) : (
          <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-border-strong" />
        )}
        <span className="truncate font-mono text-sm text-ink">
          {field.name}
        </span>
        {!field.nullable && (
          <span className="text-[10px] font-mono text-brand-rose">
            NOT NULL
          </span>
        )}
      </div>
      <span className={chipClass}>{field.category}</span>
      <span className="hidden min-w-[120px] font-mono text-[11px] text-ink-dim md:block">
        {field.nativeType}
      </span>
    </div>
  );
}
