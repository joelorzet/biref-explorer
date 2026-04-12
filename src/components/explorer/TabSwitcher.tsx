'use client';

import { IconCode, IconPlay, IconTable } from '../icons';

export type ExplorerTab = 'schema' | 'query' | 'codegen';

interface Props {
  active: ExplorerTab;
  onChange: (tab: ExplorerTab) => void;
}

const TABS: Array<{ id: ExplorerTab; label: string; Icon: typeof IconTable }> =
  [
    { id: 'schema', label: 'Schema', Icon: IconTable },
    { id: 'query', label: 'Query', Icon: IconPlay },
    { id: 'codegen', label: 'Codegen', Icon: IconCode },
  ];

export function TabSwitcher({ active, onChange }: Props) {
  return (
    <nav className="flex items-center gap-1 border-b border-border bg-bg-elevated/40 px-6">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`relative flex cursor-pointer items-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors duration-150 ${
              isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
