import 'server-only';
import type { DriverId } from '@shared/api';

export interface DriverConnectConfig {
  driver: DriverId;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

/**
 * A live connection produced by a DriverStrategy. It carries
 * everything SessionStore needs to hand off to biref and, later, to
 * tear down cleanly. The `adapter` is passed straight to
 * `Biref.builder().withAdapter(...)`.
 */
export interface DriverConnection {
  readonly adapter: unknown;
  readonly serverVersion: string;
  close(): Promise<void>;
}

/**
 * Strategy for opening a database connection and wiring it to the
 * correct biref adapter. One implementation per supported driver.
 */
export interface DriverStrategy {
  readonly id: DriverId;
  connect(config: DriverConnectConfig): Promise<DriverConnection>;
}
