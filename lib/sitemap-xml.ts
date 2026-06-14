import 'server-only';
import { CATEGORY_META, slugToCategory } from '@/lib/categories';
import { getCategoryRows, getLatestUpdatedAt, getSitemapRows } from '@/lib/data';
import { SITE_URL } from '@/lib/seo';
import type { CategorySlug } from '@/types';

const PRIORITY: Record<CategorySlug, string> = {
  banking: '0.8',
  government: '0.8',
  education: '0.7',
  medical: '0.7',
  tech: '0.7',
  science: '0.7',
  business: '0.7',
  law: '0.7',
  defence: '0.7',
  sports: '0.6',
  organisations: '0.7',
  chat: '0.6',
  slang: '0.6',
  general: '0.6',
  country: '0.7',
  state: '0.7',
};

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function robotsTxt(): string {
  // Allow everything except API and admin surfaces and faceted query URLs
  // (?page=, ?letter=, ?q=) — those dedupe to canonical hubs and would only
  // burn crawl budget. We deliberately do NOT block /_next/ (Googlebot needs
  // CSS/JS to render and assess the page) and do NOT block /search (it returns
  // `noindex, follow`, which Google can only honour if it's allowed to fetch it).
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Disallow: /*?*',
    '',
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
  ].join('\n');
}

/** Slugs of categories that currently have at least one published acronym. */
async function nonEmptyCategorySlugs(): Promise<CategorySlug[]> {
  const rows = await getCategoryRows();
  return rows.filter((r) => r.acronym_count > 0).map((r) => r.slug);
}

export async function sitemapIndexXml(): Promise<string> {
  const lastmod = await getLatestUpdatedAt();
  // Only reference child sitemaps that actually contain URLs. Empty category
  // hubs (e.g. a freshly added category with no content yet) are skipped and
  // re-appear automatically once they have published acronyms.
  const children = ['pages', ...(await nonEmptyCategorySlugs())];
  const entries = children
    .map(
      (name) => `  <sitemap>
    <loc>${SITE_URL}/sitemap-${name}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

/** Homepage + every category hub that currently has content. */
export async function pagesSitemapXml(): Promise<string> {
  const lastmod = await getLatestUpdatedAt();
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    ...(await nonEmptyCategorySlugs()).map((slug) => ({
      loc: `${SITE_URL}/category/${slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

/** Acronym URLs for one category. Returns null for an unknown slug. */
export async function categorySitemapXml(slug: string): Promise<string | null> {
  const category = slugToCategory(slug);
  if (!category) return null;
  const meta = CATEGORY_META[category];
  const rows = await getSitemapRows(category);
  const base = PRIORITY[meta.slug];

  const body = rows
    .map((r) => {
      const priority = r.search_volume_estimate > 1000 ? '0.8' : base;
      return `  <url>
    <loc>${esc(`${SITE_URL}/full-form/${r.slug}`)}</loc>
    <lastmod>${new Date(r.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'Cache-Control': 'public, max-age=3600',
} as const;

export { XML_HEADERS };
