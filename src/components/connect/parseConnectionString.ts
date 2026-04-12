import type { ConnectBody, DriverId } from '@shared/api';
import { driverById } from './drivers';

export interface ParseResult {
  ok: boolean;
  value?: ConnectBody;
  error?: string;
}

export function parseConnectionString(
  raw: string,
  driver: DriverId,
): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: 'Paste a connection string' };
  }

  const descriptor = driverById(driver);
  try {
    // Normalize the scheme to http:// so WHATWG URL can parse it,
    // then extract the individual parts.
    const normalized = trimmed.replace(
      /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//,
      'http://',
    );
    const url = new URL(normalized);

    const host = url.hostname || 'localhost';
    const port = url.port ? Number(url.port) : descriptor.defaultPort;
    const user = decodeURIComponent(url.username || '');
    const password = decodeURIComponent(url.password || '');
    const database = url.pathname.replace(/^\//, '');

    if (!database) {
      return {
        ok: false,
        error: 'Connection string is missing a database name',
      };
    }

    return {
      ok: true,
      value: {
        driver,
        host,
        port,
        user,
        password,
        database,
        ssl: url.searchParams.get('sslmode') === 'require',
      },
    };
  } catch {
    return { ok: false, error: 'Could not parse connection string' };
  }
}
