import type { ConnectBody, ConnectResponse } from '@shared/api';
import { NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/container/server';
import { DEFAULT_DRIVER } from '@/lib/services/biref/drivers/DriverRegistry';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = (await req.json()) as ConnectBody;
  if (!body?.host || !body?.database || !body?.user) {
    return NextResponse.json(
      { error: 'Missing required connection fields' },
      { status: 400 },
    );
  }
  try {
    const { sessionStore, drivers } = getServerContainer();
    const driver = body.driver ?? DEFAULT_DRIVER;
    if (!drivers.has(driver)) {
      return NextResponse.json(
        { error: `Driver "${driver}" is not supported on this server` },
        { status: 400 },
      );
    }
    const result = await sessionStore.create({
      driver,
      host: body.host,
      port: body.port ?? (driver === 'mysql' ? 3306 : 5432),
      user: body.user,
      password: body.password,
      database: body.database,
      ssl: body.ssl,
    });
    const payload: ConnectResponse = result;
    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: 'Could not connect', detail: (err as Error).message },
      { status: 400 },
    );
  }
}
