import type { QueryBody, ToSqlResponse } from '@shared/api';
import { NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/container/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = (await req.json()) as QueryBody;
  try {
    const { birefScanner } = getServerContainer();
    const result = birefScanner.toSql(body);
    const payload: ToSqlResponse = result;
    return NextResponse.json(payload);
  } catch (err) {
    console.error('[toSql]', err);
    return NextResponse.json(
      { error: 'Failed to generate SQL', detail: (err as Error).message },
      { status: 400 },
    );
  }
}
