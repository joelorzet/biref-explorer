import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateSchema } from '@biref/scanner';
import type { CodegenResponse, QueryBody, ScanResponse } from '@shared/api';
import { toJsonSafe } from '@/lib/utils/jsonSafe';
import { QueryPlanApplier } from './QueryPlanApplier';
import type {
  IBirefScannerService,
  IDataModelMapper,
  ISessionStore,
  QueryResult,
} from './types';

const SCANNER_DTS_PATH = join(
  process.cwd(),
  'node_modules/@biref/scanner/dist/index.d.ts',
);

let cachedScannerDts: string | null = null;

function getScannerDts(): string {
  if (!cachedScannerDts) {
    cachedScannerDts = readFileSync(SCANNER_DTS_PATH, 'utf-8');
  }
  return cachedScannerDts;
}

/**
 * Server-side orchestration for the @biref/scanner SDK. Pulls an
 * active session out of the store, runs the requested operation,
 * and returns DTO-safe results. All paradigm-specific logic lives
 * in the injected collaborators (SessionStore, DataModelMapper,
 * QueryPlanApplier).
 */
export class BirefScannerService implements IBirefScannerService {
  constructor(
    private readonly sessions: ISessionStore,
    private readonly mapper: IDataModelMapper,
    private readonly queryApplier: QueryPlanApplier = new QueryPlanApplier(),
  ) {}

  async scan(
    sessionId: string,
    namespaces: 'all' | string[],
  ): Promise<ScanResponse> {
    const session = this.sessions.require(sessionId);
    const started = performance.now();
    const model = await (session.biref as any).scan({ namespaces });
    session.model = model;
    return {
      model: this.mapper.toDataModelDTO(model),
      elapsedMs: Math.round(performance.now() - started),
    };
  }

  async codegen(
    sessionId: string,
    namespaces: 'all' | string[],
  ): Promise<CodegenResponse> {
    const session = this.sessions.require(sessionId);
    const started = performance.now();
    const model =
      session.model ?? (await (session.biref as any).scan({ namespaces }));
    session.model = model;
    return {
      schemaTs: generateSchema(model),
      scannerDts: getScannerDts(),
      entityCount: model.entities.length,
      elapsedMs: Math.round(performance.now() - started),
    };
  }

  async query(body: QueryBody): Promise<QueryResult> {
    const session = this.sessions.require(body.sessionId);
    if (!session.model) {
      throw new Error('Scan the database first');
    }
    const started = performance.now();
    const root = (session.biref as any).query(session.model) as Record<
      string,
      Record<string, any>
    >;
    const ns = root[body.namespace];
    if (!ns) {
      throw new Error(`Unknown namespace ${body.namespace}`);
    }
    const entityChain = ns[body.entity];
    if (!entityChain) {
      throw new Error(`Unknown entity ${body.namespace}.${body.entity}`);
    }
    const applied = this.queryApplier.apply(entityChain, body);
    const rows =
      body.mode === 'findFirst'
        ? await applied.findFirst()
        : await applied.findMany();
    return {
      rows: toJsonSafe(rows ?? null),
      rowCount: Array.isArray(rows) ? rows.length : rows ? 1 : 0,
      elapsedMs: Math.round(performance.now() - started),
    };
  }
}
