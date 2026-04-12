import 'server-only';
import { Biref } from '@biref/scanner';
import type { ConnectResponse } from '@shared/api';
import type { DriverRegistry } from './drivers/DriverRegistry';
import type { BirefSession, ConnectConfig, ISessionStore } from './types';

const globalStore = globalThis as unknown as {
  __birefSessions?: Map<string, BirefSession>;
};

/**
 * In-memory session registry. Persisted on `globalThis` so the
 * Next.js dev-mode module reload does not blow up live connections.
 * Driver-agnostic: each session carries a DriverConnection produced
 * by the strategy registered for its driver id.
 */
export class SessionStore implements ISessionStore {
  private readonly sessions: Map<string, BirefSession>;

  constructor(private readonly drivers: DriverRegistry) {
    if (!globalStore.__birefSessions) {
      globalStore.__birefSessions = new Map();
    }
    this.sessions = globalStore.__birefSessions;
  }

  async create(config: ConnectConfig): Promise<ConnectResponse> {
    const strategy = this.drivers.require(config.driver);
    const connection = await strategy.connect(config);
    const biref = Biref.builder()
      .withAdapter(connection.adapter as any)
      .build();
    const id = crypto.randomUUID();
    this.sessions.set(id, {
      id,
      driver: config.driver,
      connection,
      biref,
      database: config.database,
    });
    return {
      sessionId: id,
      database: config.database,
      serverVersion: connection.serverVersion,
    };
  }

  async destroy(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    try {
      await session.connection.close();
    } catch {}
    this.sessions.delete(sessionId);
  }

  get(sessionId: string): BirefSession | undefined {
    return this.sessions.get(sessionId);
  }

  require(sessionId: string): BirefSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }
}
