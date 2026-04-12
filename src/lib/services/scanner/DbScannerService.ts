import type {
  CodegenResponse,
  ConnectBody,
  ConnectResponse,
  QueryBody,
  QueryResponse,
  ScanResponse,
} from '@shared/api';
import type { IApiClient } from '../http/types';
import type { IDbScannerService, Namespaces } from './types';

/**
 * Client-side resource service for the database-scanner API. Owns
 * the REST endpoints and the request/response shapes; delegates the
 * wire protocol to the injected IApiClient.
 */
export class DbScannerService implements IDbScannerService {
  constructor(private readonly http: IApiClient) {}

  connect(body: ConnectBody): Promise<ConnectResponse> {
    return this.http.post<ConnectResponse>('/api/connect', body);
  }

  disconnect(sessionId: string): Promise<void> {
    return this.http.post<void>('/api/disconnect', { sessionId });
  }

  scan(
    sessionId: string,
    namespaces: Namespaces = 'all',
  ): Promise<ScanResponse> {
    return this.http.post<ScanResponse>('/api/scan', {
      sessionId,
      namespaces,
    });
  }

  codegen(
    sessionId: string,
    namespaces: Namespaces = 'all',
  ): Promise<CodegenResponse> {
    return this.http.post<CodegenResponse>('/api/codegen', {
      sessionId,
      namespaces,
    });
  }

  query(body: QueryBody): Promise<QueryResponse> {
    return this.http.post<QueryResponse>('/api/query', body);
  }
}
