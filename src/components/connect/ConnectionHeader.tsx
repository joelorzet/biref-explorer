import { IconDatabase } from '../icons';

export function ConnectionHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/30">
          <IconDatabase className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Biref Explorer
          </div>
          <div className="text-[11px] font-mono text-ink-dim">
            @biref/scanner · v0.0.2
          </div>
        </div>
      </div>
      <a
        href="https://github.com/joelorzet/biref-db-scanner"
        target="_blank"
        rel="noreferrer"
        className="text-xs text-ink-muted hover:text-ink transition-colors"
      >
        github
      </a>
    </header>
  );
}
