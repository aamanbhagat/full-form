// proxy.ts — project root. Replaces middleware.ts in Next.js 16.
// Runs before routes render: admin auth + query-string canonicalisation.
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Admin gate — no valid token cookie ⇒ bounce to login.
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || token !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Canonicalise acronym pages: a query string on a content URL is never canonical.
  // Strip it with a single permanent redirect to the clean path — keeps the visitor,
  // dedupes the URL, and never sends a real user to a 404. Only the page itself
  // (one segment) — never sub-resources like the hashed /opengraph-image URL.
  if (url.pathname.startsWith('/full-form/') && url.search !== '') {
    const rest = url.pathname.slice('/full-form/'.length);
    if (!rest.includes('/')) {
      return NextResponse.redirect(new URL(url.pathname, request.url), 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Category keeps its query string (?page=) for pagination, so it is not matched here.
  matcher: ['/full-form/:path*', '/admin/:path*'],
};
