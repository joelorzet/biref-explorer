import 'server-only';
import { postgresAdapter } from '@biref/scanner';
import pg from 'pg';
import type {
  DriverConnectConfig,
  DriverConnection,
  DriverStrategy,
} from './types';

/**
 * Postgres strategy. Opens a `pg.Client`, probes the server version,
 * and wraps it in the scanner's postgresAdapter. `close()` shuts the
 * driver client down.
 */
export class PostgresDriverStrategy implements DriverStrategy {
  readonly id = 'postgres' as const;

  async connect(config: DriverConnectConfig): Promise<DriverConnection> {
    const client = new pg.Client({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    });
    await client.connect();
    const version = await client.query<{ version: string }>('SELECT version()');
    return {
      adapter: postgresAdapter.create(client),
      serverVersion: version.rows[0]?.version ?? 'unknown',
      close: () => client.end(),
    };
  }
}
