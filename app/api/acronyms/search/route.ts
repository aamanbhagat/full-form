import { NextResponse, type NextRequest } from 'next/server';
import { searchAcronyms } from '@/lib/data';
import { logSearch } from '@/lib/search-log';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json([]);

  const results = await searchAcronyms(q, 10);

  // Fire-and-forget analytics; never blocks or fails the response.
  void logSearch(q, results.length);

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
