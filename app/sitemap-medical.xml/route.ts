import { NextResponse } from 'next/server';
import { categorySitemapXml, XML_HEADERS } from '@/lib/sitemap-xml';

export async function GET() {
  const xml = await categorySitemapXml('medical');
  if (!xml) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(xml, { headers: XML_HEADERS });
}
