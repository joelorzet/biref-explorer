'use client';

import type { DataModelDTO, EntityDTO } from '@shared/api';
import { useSidebar } from '@/hooks/useSidebar';
import { IconSearch } from '../icons';
import { SidebarNamespace } from './SidebarNamespace';

interface Props {
  model: DataModelDTO;
  active: { namespace: string; name: string } | null;
  onSelect: (entity: EntityDTO) => void;
}

export function Sidebar({ model, active, onSelect }: Props) {
  const { query, setQuery, grouped, isCollapsed, toggleCollapsed } =
    useSidebar(model);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-bg-elevated/50">
      <div className="border-b border-border p-3">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-dim" />
          <input
            placeholder="Filter tables"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-8 py-1.5 text-xs"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {grouped.map(([ns, entities]) => (
          <SidebarNamespace
            key={ns}
            namespace={ns}
            entities={entities}
            active={active}
            collapsed={isCollapsed(ns)}
            onToggleCollapse={() => toggleCollapsed(ns)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}
