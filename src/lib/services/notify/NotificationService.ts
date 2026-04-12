'use client';

import type {
  CodegenResponse,
  ConnectResponse,
  QueryResponse,
  ScanResponse,
} from '@shared/api';
import type { SileoOptions } from 'sileo';
import type { IToastAdapter } from './types';

interface ConnectionTarget {
  host: string;
  database: string;
}

interface QueryTarget {
  namespace: string;
  entity: string;
}

function describeError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Unknown error';
}

/**
 * Domain-aware notification service. Wraps a generic toast adapter
 * and exposes one method per application concern so call sites don't
 * rebuild title / description strings each time.
 */
export class NotificationService {
  constructor(private readonly toast: IToastAdapter) {}

  connection = {
    run: <T extends ConnectResponse>(
      promise: Promise<T>,
      target: ConnectionTarget,
    ): Promise<T> =>
      this.toast.promise<T>(promise, {
        loading: {
          title: 'Connecting',
          description: `${target.host} · ${target.database}`,
        },
        success: (session) => ({
          title: 'Connected',
          description: `${session.database}`,
        }),
        error: (err) => ({
          title: 'Connection failed',
          description: describeError(err),
        }),
      }),
    disconnected: () =>
      this.toast.info({ title: 'Disconnected', duration: 2500 }),
  };

  scan = {
    run: <T extends ScanResponse>(promise: Promise<T>): Promise<T> =>
      this.toast.promise<T>(promise, {
        loading: {
          title: 'Scanning database',
          description: 'Walking entities and relationships',
        },
        success: (res) => ({
          title: 'Scan complete',
          description: `${res.model.stats.entityCount} entities · ${res.model.stats.relationshipCount} relations · ${res.elapsedMs}ms`,
        }),
        error: (err) => ({
          title: 'Scan failed',
          description: describeError(err),
        }),
      }),
  };

  codegen = {
    run: <T extends CodegenResponse>(promise: Promise<T>): Promise<T> =>
      this.toast.promise<T>(promise, {
        loading: {
          title: 'Generating schema',
          description: 'Emitting typed biref.schema.ts',
        },
        success: (res) => ({
          title: 'Schema generated',
          description: `${res.entityCount} entities · ${res.elapsedMs}ms`,
        }),
        error: (err) => ({
          title: 'Codegen failed',
          description: describeError(err),
        }),
      }),
    copied: () =>
      this.toast.success({ title: 'Copied to clipboard', duration: 2000 }),
  };

  query = {
    run: <T extends QueryResponse>(
      promise: Promise<T>,
      target: QueryTarget,
    ): Promise<T> =>
      this.toast.promise<T>(promise, {
        loading: {
          title: 'Running query',
          description: `${target.namespace}.${target.entity}`,
        },
        success: (res) => ({
          title: `${res.rowCount} ${res.rowCount === 1 ? 'row' : 'rows'}`,
          description: `${target.namespace}.${target.entity} · ${res.elapsedMs}ms`,
        }),
        error: (err) => ({
          title: 'Query failed',
          description: describeError(err),
        }),
      }),
  };

  success(opts: SileoOptions): void {
    this.toast.success(opts);
  }
  error(opts: SileoOptions): void {
    this.toast.error(opts);
  }
  info(opts: SileoOptions): void {
    this.toast.info(opts);
  }
  warning(opts: SileoOptions): void {
    this.toast.warning(opts);
  }
}
