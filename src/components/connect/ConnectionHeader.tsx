'use client';

import { useGithubStars } from '@/hooks/useGithubStars';
import { SCANNER_VERSION } from '@/lib/constants';
import { IconBranch, IconDatabase } from '../icons';

const REPO_URL = 'https://github.com/joelorzet/biref-db-scanner';

export function ConnectionHeader() {
  const stars = useGithubStars();

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
            @biref/scanner · v{SCANNER_VERSION}
          </div>
        </div>
      </div>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
      >
        <IconBranch className="h-3.5 w-3.5" />
        {stars !== null && <span className="font-mono text-ink">{stars}</span>}
        GitHub
      </a>
    </header>
  );
}
