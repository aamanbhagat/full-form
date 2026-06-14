import { NextResponse, type NextRequest } from 'next/server';
import { processAcronym } from '@/lib/generate';

// Admin-gated content generation. Vercel functions cap at 60s, so each call
// processes at most 30 acronyms; the admin UI batches larger lists.
const MAX_PER_CALL = 30;

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-admin-token');
  if (!process.env.ADMIN_SECRET_TOKEN || token !== process.env.ADMIN_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let acronyms: unknown;
  try {
    ({ acronyms } = (await request.json()) as { acronyms?: unknown });
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  if (!Array.isArray(acronyms) || acronyms.length === 0) {
    return NextResponse.json(
      { error: 'acronyms array required' },
      { status: 400 },
    );
  }

  const batch = acronyms
    .filter((a): a is string => typeof a === 'string')
    .slice(0, MAX_PER_CALL);

  const results = [];
  for (const acronym of batch) {
    results.push(await processAcronym(acronym));
  }

  return NextResponse.json({ results });
}
