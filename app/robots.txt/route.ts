import { NextResponse } from 'next/server';
import { robotsTxt } from '@/lib/sitemap-xml';

export function GET() {
  return new NextResponse(robotsTxt(), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
