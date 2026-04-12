import 'server-only';
import { BirefScannerService } from '@/lib/services/biref/BirefScannerService';
import { DataModelMapper } from '@/lib/services/biref/DataModelMapper';
import {
  buildDefaultDriverRegistry,
  type DriverRegistry,
} from '@/lib/services/biref/drivers/DriverRegistry';
import { SessionStore } from '@/lib/services/biref/SessionStore';
import type {
  IBirefScannerService,
  IDataModelMapper,
  ISessionStore,
} from '@/lib/services/biref/types';

interface ServerContainer {
  drivers: DriverRegistry;
  sessionStore: ISessionStore;
  dataModelMapper: IDataModelMapper;
  birefScanner: IBirefScannerService;
}

const REQUIRED_KEYS = [
  'drivers',
  'sessionStore',
  'dataModelMapper',
  'birefScanner',
] as const satisfies ReadonlyArray<keyof ServerContainer>;

const globalStore = globalThis as unknown as {
  __serverContainer?: ServerContainer;
};

function buildContainer(): ServerContainer {
  const drivers = buildDefaultDriverRegistry();
  const sessionStore = new SessionStore(drivers);
  const dataModelMapper = new DataModelMapper();
  const birefScanner = new BirefScannerService(sessionStore, dataModelMapper);
  return { drivers, sessionStore, dataModelMapper, birefScanner };
}

function isStaleContainer(
  container: ServerContainer | undefined,
): container is undefined {
  if (!container) {
    return true;
  }
  // Dev-mode HMR can leave a cached container built by an older
  // version of this module, missing fields or methods we added since.
  // Treat any partial shape as stale so a fresh container gets built.
  if (
    REQUIRED_KEYS.some(
      (key) => (container as unknown as Record<string, unknown>)[key] == null,
    )
  ) {
    return true;
  }
  // Check that the scanner service has the latest methods
  return typeof (container.birefScanner as any).toSql !== 'function';
}

export function getServerContainer(): ServerContainer {
  if (isStaleContainer(globalStore.__serverContainer)) {
    globalStore.__serverContainer = buildContainer();
  }
  return globalStore.__serverContainer as ServerContainer;
}
