'use client';

import { useState } from 'react';
import { useExplorerSession } from '@/hooks/useExplorerSession';
import { ConnectionPanel } from './ConnectionPanel';
import { ExplorerContent } from './explorer/ExplorerContent';
import { ExplorerHeader } from './explorer/ExplorerHeader';
import { Sidebar } from './explorer/Sidebar';
import { type ExplorerTab, TabSwitcher } from './explorer/TabSwitcher';
import { ScannerOverlay } from './ScannerOverlay';

export function Explorer() {
  const {
    session,
    model,
    scanning,
    scanError,
    activeEntity,
    setActiveEntity,
    connect,
    disconnect,
    rescan,
  } = useExplorerSession();
  const [tab, setTab] = useState<ExplorerTab>('schema');

  if (!session) {
    return <ConnectionPanel onConnected={connect} />;
  }

  return (
    <div className="flex h-screen flex-col">
      <ScannerOverlay
        running={scanning}
        mode={session.mode}
        database={session.session.database}
      />
      <ExplorerHeader
        database={session.session.database}
        model={model}
        scanning={scanning}
        onRescan={rescan}
        onDisconnect={disconnect}
      />
      {scanError ? (
        <div className="flex-1 p-8">
          <div className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 p-4 font-mono text-xs text-brand-rose">
            Scan failed: {scanError}
          </div>
        </div>
      ) : model ? (
        <div className="flex min-h-0 flex-1">
          <Sidebar
            model={model}
            active={
              activeEntity
                ? { namespace: activeEntity.namespace, name: activeEntity.name }
                : null
            }
            onSelect={setActiveEntity}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <TabSwitcher active={tab} onChange={setTab} />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto h-full">
                <ExplorerContent
                  tab={tab}
                  sessionId={session.session.sessionId}
                  model={model}
                  entity={activeEntity}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
