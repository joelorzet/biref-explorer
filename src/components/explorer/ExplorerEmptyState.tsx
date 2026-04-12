import { IconArrowLeft } from '../icons';

export function ExplorerEmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-center gap-3 text-xs text-ink-dim">
        <IconArrowLeft className="h-4 w-4" />
        Pick a table from the sidebar to inspect it
      </div>
    </div>
  );
}
