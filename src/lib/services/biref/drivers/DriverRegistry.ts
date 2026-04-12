import 'server-only';
import type { DriverId } from '@shared/api';
import { PostgresDriverStrategy } from './PostgresDriverStrategy';
import type { DriverStrategy } from './types';

export const DEFAULT_DRIVER: DriverId = 'postgres';

/**
 * Runtime registry of DriverStrategy instances. SessionStore asks it
 * for the strategy that matches the incoming `driver` field; unknown
 * drivers throw a clear error instead of silently falling back.
 *
 * To add a new driver: implement DriverStrategy and register it in
 * `buildDefaultDriverRegistry()` below.
 */
export class DriverRegistry {
  private readonly strategies = new Map<DriverId, DriverStrategy>();

  register(strategy: DriverStrategy): this {
    this.strategies.set(strategy.id, strategy);
    return this;
  }

  has(id: DriverId): boolean {
    return this.strategies.has(id);
  }

  require(id: DriverId): DriverStrategy {
    const strategy = this.strategies.get(id);
    if (!strategy) {
      const known = [...this.strategies.keys()].join(', ') || '(none)';
      throw new Error(
        `Driver "${id}" is not supported on this server. Registered: ${known}.`,
      );
    }
    return strategy;
  }

  ids(): readonly DriverId[] {
    return [...this.strategies.keys()];
  }
}

export function buildDefaultDriverRegistry(): DriverRegistry {
  const registry = new DriverRegistry();
  registry.register(new PostgresDriverStrategy());
  return registry;
}
