'use client';

import { ApiClient } from '@/lib/services/http/ApiClient';
import type { IApiClient } from '@/lib/services/http/types';
import { NotificationService } from '@/lib/services/notify/NotificationService';
import { SileoAdapter } from '@/lib/services/notify/SileoAdapter';
import { DbScannerService } from '@/lib/services/scanner/DbScannerService';
import type { IDbScannerService } from '@/lib/services/scanner/types';

interface ClientContainer {
  http: IApiClient;
  dbScanner: IDbScannerService;
  notifier: NotificationService;
}

let instance: ClientContainer | null = null;

function buildContainer(): ClientContainer {
  const http = new ApiClient();
  const dbScanner = new DbScannerService(http);
  const notifier = new NotificationService(new SileoAdapter());
  return { http, dbScanner, notifier };
}

export function getClientContainer(): ClientContainer {
  if (!instance) {
    instance = buildContainer();
  }
  return instance;
}

export const dbScanner = (): IDbScannerService =>
  getClientContainer().dbScanner;
export const notifier = (): NotificationService =>
  getClientContainer().notifier;
