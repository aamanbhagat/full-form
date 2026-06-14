// Canonical URL helpers — one source of truth for absolute links.
// The fallback is the live production origin (NOT localhost) so that if
// NEXT_PUBLIC_SITE_URL is ever missing in a deploy, canonicals, sitemaps, and
// JSON-LD still point at the real domain instead of leaking localhost into the
// index. Local dev sets NEXT_PUBLIC_SITE_URL=http://localhost:3000 in .env.local.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://fullformhub.live'
).replace(/\/$/, '');

export const SITE_NAME = 'FullFormHub';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
