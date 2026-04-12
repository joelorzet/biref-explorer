import type {
  CodegenResponse,
  ConnectBody,
  ConnectResponse,
  QueryBody,
  QueryResponse,
  ScanResponse,
} from '@shared/api';

export type Namespaces = 'all' | readonly string[];

export interface IDbScannerService {
  connect(body: ConnectBody): Promise<ConnectResponse>;
  disconnect(sessionId: string): Promise<void>;
  scan(sessionId: string, namespaces?: Namespaces): Promise<ScanResponse>;
  codegen(sessionId: string, namespaces?: Namespaces): Promise<CodegenResponse>;
  query(body: QueryBody): Promise<QueryResponse>;
}
