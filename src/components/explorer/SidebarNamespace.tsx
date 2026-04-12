'use client';

import type { EntityDTO } from '@shared/api';
import { IconChevronDown, IconChevronRight, IconTable } from '../icons';

interface Props {
  namespace: string;
  entities: EntityDTO[];
  active: { namespace: string; name: string } | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (entity: EntityDTO) => void;
}

export function SidebarNamespace({
  namespace,
  entities,
  active,
  collapsed,
  onToggleCollapse,
  onSelect,
}: Props) {
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:bg-bg-hover"
      >
        {collapsed ? (
          <IconChevronRight className="h-3 w-3" />
        ) : (
          <IconChevronDown className="h-3 w-3" />
        )}
        <span>{namespace}</span>
        <span className="ml-auto text-[10px] text-ink-dim">
          {entities.length}
        </span>
      </button>
      {!collapsed && (
        <ul className="mt-1 space-y-0.5">
          {entities.map((entity) => {
            const isActive =
              active?.namespace === entity.namespace &&
              active?.name === entity.name;
            return (
              <li key={entity.name}>
                <button
                  type="button"
                  onClick={() => onSelect(entity)}
                  className={`group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-mono transition-colors duration-150 ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-ink-muted hover:bg-bg-hover hover:text-ink'
                  }`}
                >
                  <IconTable
                    className={`h-3 w-3 shrink-0 ${
                      isActive ? 'text-accent' : 'text-ink-dim'
                    }`}
                  />
                  <span className="truncate">{entity.name}</span>
                  <span className="ml-auto text-[10px] text-ink-dim">
                    {entity.fields.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
