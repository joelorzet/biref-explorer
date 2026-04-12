import 'server-only';
import { mysqlAdapter } from '@biref/scanner';
import mysql from 'mysql2/promise';
import type {
  DriverConnectConfig,
  DriverConnection,
  DriverStrategy,
} from './types';

/**
 * MySQL strategy. Opens a `mysql2/promise` connection, probes the
 * server version, and wraps it in the scanner's mysqlAdapter.
 * `close()` ends the connection.
 */
export class MySQLDriverStrategy implements DriverStrategy {
  readonly id = 'mysql' as const;

  async connect(config: DriverConnectConfig): Promise<DriverConnection> {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    });
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      'SELECT version() AS version',
    );
    return {
      adapter: mysqlAdapter.create(connection as any),
      serverVersion: rows[0]?.version ?? 'unknown',
      close: () => connection.end(),
    };
  }
}
