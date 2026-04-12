import type { QueryBody, QueryResponse } from '@shared/api';
import { NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/container/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = (await req.json()) as QueryBody;
  try {
    const { birefScanner } = getServerContainer();
    const result = await birefScanner.query(body);
    const payload: QueryResponse = result;
    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: 'Query failed', detail: (err as Error).message },
      { status: 400 },
    );
  }
}
