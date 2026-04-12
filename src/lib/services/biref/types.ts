import 'server-only';
import type { DataModel } from '@biref/scanner';
import type {
  CodegenResponse,
  ConnectResponse,
  DataModelDTO,
  DriverId,
  QueryBody,
  ScanResponse,
} from '@shared/api';
import type { DriverConnection } from './drivers/types';

export interface BirefSession {
  id: string;
  driver: DriverId;
  connection: DriverConnection;
  biref: unknown;
  model?: DataModel;
  database: string;
}

export interface ConnectConfig {
  driver: DriverId;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export interface QueryResult {
  rows: unknown;
  rowCount: number;
  elapsedMs: number;
}

export interface ISessionStore {
  create(config: ConnectConfig): Promise<ConnectResponse>;
  destroy(sessionId: string): Promise<void>;
  get(sessionId: string): BirefSession | undefined;
  require(sessionId: string): BirefSession;
}

export interface IBirefScannerService {
  scan(sessionId: string, namespaces: 'all' | string[]): Promise<ScanResponse>;
  codegen(
    sessionId: string,
    namespaces: 'all' | string[],
  ): Promise<CodegenResponse>;
  query(body: QueryBody): Promise<QueryResult>;
}

export interface IDataModelMapper {
  toDataModelDTO(model: DataModel): DataModelDTO;
}
