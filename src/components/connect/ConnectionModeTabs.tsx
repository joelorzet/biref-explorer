'use client';

import { IconKey, IconLink } from '../icons';

export type ConnectionMode = 'url' | 'fields';

interface Props {
  mode: ConnectionMode;
  onChange: (mode: ConnectionMode) => void;
}

export function ConnectionModeTabs({ mode, onChange }: Props) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-border text-[11px] font-mono">
      <TabButton
        active={mode === 'url'}
        onClick={() => onChange('url')}
        icon={<IconLink className="h-3 w-3" />}
        label="Paste URL"
      />
      <TabButton
        active={mode === 'fields'}
        onClick={() => onChange('fields')}
        icon={<IconKey className="h-3 w-3" />}
        label="Fields"
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 border-border px-2.5 py-1.5 transition-colors [&:not(:first-child)]:border-l ${
        active ? 'bg-accent/15 text-accent' : 'text-ink-muted hover:bg-bg-hover'
      }`}
    >
      {icon} {label}
    </button>
  );
}
