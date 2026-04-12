import type { CodegenResponse, ScanBody } from '@shared/api';
import { NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/container/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = (await req.json()) as ScanBody;
  if (!body?.sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }
  try {
    const { birefScanner } = getServerContainer();
    const result = await birefScanner.codegen(
      body.sessionId,
      body.namespaces ?? 'all',
    );
    const payload: CodegenResponse = result;
    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: 'Codegen failed', detail: (err as Error).message },
      { status: 400 },
    );
  }
}
