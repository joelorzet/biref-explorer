'use client';

import type {
  ConnectBody,
  ConnectResponse,
  DataModelDTO,
  EntityDTO,
} from '@shared/api';
import { useCallback, useEffect, useState } from 'react';
import type { ScanMode } from '@/components/connect/ScanModeSelector';
import { dbScanner, notifier } from '@/lib/container/client';

export interface ExplorerSession {
  session: ConnectResponse;
  credentials: ConnectBody;
  mode: ScanMode;
}

export function useExplorerSession() {
  const [session, setSession] = useState<ExplorerSession | null>(null);
  const [model, setModel] = useState<DataModelDTO | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeEntity, setActiveEntity] = useState<EntityDTO | null>(null);

  const scan = useCallback(async (sessionId: string) => {
    setScanning(true);
    setScanError(null);
    try {
      const result = await notifier().scan.run(dbScanner().scan(sessionId));
      setModel(result.model);
      setActiveEntity(result.model.entities[0] ?? null);
    } catch (err) {
      setScanError((err as Error).message);
    } finally {
      setScanning(false);
    }
  }, []);

  const connect = useCallback(
    (s: ConnectResponse, credentials: ConnectBody, mode: ScanMode) => {
      setSession({ session: s, credentials, mode });
      scan(s.sessionId);
    },
    [scan],
  );

  const disconnect = useCallback(async () => {
    if (session) {
      try {
        await dbScanner().disconnect(session.session.sessionId);
      } catch {}
      notifier().connection.disconnected();
    }
    setSession(null);
    setModel(null);
    setActiveEntity(null);
    setScanError(null);
  }, [session]);

  useEffect(() => {
    if (!model || activeEntity) {
      return;
    }
    setActiveEntity(model.entities[0] ?? null);
  }, [model, activeEntity]);

  return {
    session,
    model,
    scanning,
    scanError,
    activeEntity,
    setActiveEntity,
    connect,
    disconnect,
    rescan: session ? () => scan(session.session.sessionId) : () => {},
  };
}
