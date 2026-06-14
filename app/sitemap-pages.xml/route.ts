import { NextResponse } from 'next/server';
import { pagesSitemapXml, XML_HEADERS } from '@/lib/sitemap-xml';

export async function GET() {
  return new NextResponse(await pagesSitemapXml(), { headers: XML_HEADERS });
}
