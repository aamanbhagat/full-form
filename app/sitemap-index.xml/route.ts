import { NextResponse } from 'next/server';
import { sitemapIndexXml, XML_HEADERS } from '@/lib/sitemap-xml';

export async function GET() {
  return new NextResponse(await sitemapIndexXml(), { headers: XML_HEADERS });
}
