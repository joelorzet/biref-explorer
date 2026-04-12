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

export function getServerContainer(): ServerContainer {
  if (!globalStore.__serverContainer) {
    globalStore.__serverContainer = buildContainer();
  }
  return globalStore.__serverContainer;
}
