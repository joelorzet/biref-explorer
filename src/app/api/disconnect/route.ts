import { NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/container/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { sessionId } = (await req.json()) as { sessionId?: string };
  if (sessionId) {
    await getServerContainer().sessionStore.destroy(sessionId);
  }
  return NextResponse.json({ ok: true });
}
