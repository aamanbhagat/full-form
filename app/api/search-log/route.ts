import { NextResponse, type NextRequest } from 'next/server';
import { logSearch } from '@/lib/search-log';

export async function POST(request: NextRequest) {
  let query = '';
  let resultCount = 0;
  try {
    const body = (await request.json()) as {
      query?: unknown;
      result_count?: unknown;
    };
    query = typeof body.query === 'string' ? body.query.trim() : '';
    resultCount =
      typeof body.result_count === 'number' ? body.result_count : 0;
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  if (query.length < 1) {
    return NextResponse.json({ error: 'query required' }, { status: 400 });
  }

  await logSearch(query, resultCount);
  return NextResponse.json({ ok: true });
}
