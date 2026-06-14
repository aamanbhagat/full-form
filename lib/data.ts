import 'server-only';
import { cache } from 'react';
import type {
  AcronymRow,
  AcronymSummary,
  Category,
  CategoryRow,
} from '@/types';
import { CATEGORIES } from '@/types';
import {
  buildCategoryRows,
  CATEGORY_META,
  categoryToSlug,
} from '@/lib/categories';
import { azBucket } from '@/lib/slug';
import { MOCK_ACRONYMS } from '@/lib/mock-data';
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from '@/lib/supabase-server';
import { getSql, isPgConfigured, mapAcronymRow, mapSummary } from '@/lib/pg';

// Data resolves REST → direct Postgres → bundled mock. Reads are deduped within
// a request with React `cache`; freshness comes from page-level `revalidate`
// (ISR). Cache Components / `use cache` is intentionally not used here: it runs
// cached functions in an isolated env that doesn't play well with a stateful pg
// connection pool during prerender.

export const PER_PAGE = 30;

const SUMMARY_COLS = 'acronym, full_form, slug, category';

export interface CategoryListing {
  items: AcronymSummary[];
  total: number;
  page: number;
  perPage: number;
  availableLetters: string[];
}

function toSummary(row: AcronymRow): AcronymSummary {
  return {
    acronym: row.acronym,
    full_form: row.full_form,
    slug: row.slug,
    category: row.category,
  };
}

// ─── Category listing (homepage grid + counts) ───────────────
export const getCategoryRows = cache(async (): Promise<CategoryRow[]> => {
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c, 0]),
  ) as Record<Category, number>;

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('categories')
      .select('slug, acronym_count');
    for (const cat of CATEGORIES) {
      const slug = categoryToSlug(cat);
      counts[cat] = data?.find((r) => r.slug === slug)?.acronym_count ?? 0;
    }
    return buildCategoryRows(counts);
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql<{ category: Category; c: number }[]>`
      select category, count(*)::int as c from acronyms
      where is_published and is_reviewed group by category`;
    for (const r of rows) counts[r.category] = r.c;
    return buildCategoryRows(counts);
  }

  for (const row of MOCK_ACRONYMS) counts[row.category] += 1;
  return buildCategoryRows(counts);
});

// ─── Trending (homepage) ─────────────────────────────────────
export const getTrendingAcronyms = cache(
  async (limit = 10): Promise<AcronymSummary[]> => {
    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('acronyms')
        .select(SUMMARY_COLS)
        .eq('is_published', true)
        .eq('is_reviewed', true)
        .order('search_volume_estimate', { ascending: false })
        .limit(limit);
      return (data as AcronymSummary[] | null) ?? [];
    }

    if (isPgConfigured()) {
      const sql = getSql();
      const rows = await sql`
        select acronym, full_form, slug, category from acronyms
        where is_published and is_reviewed
        order by search_volume_estimate desc limit ${limit}`;
      return rows.map(mapSummary);
    }

    return [...MOCK_ACRONYMS]
      .sort((a, b) => b.search_volume_estimate - a.search_volume_estimate)
      .slice(0, limit)
      .map(toSummary);
  },
);

// ─── Single acronym (full-form page) ─────────────────────────
export const getAcronymBySlug = cache(
  async (slug: string): Promise<AcronymRow | null> => {
    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from('acronyms')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .eq('is_reviewed', true)
        .maybeSingle();
      return (data as AcronymRow | null) ?? null;
    }

    if (isPgConfigured()) {
      const sql = getSql();
      const rows = await sql`
        select * from acronyms
        where slug = ${slug} and is_published and is_reviewed limit 1`;
      return rows[0] ? mapAcronymRow(rows[0]) : null;
    }

    return MOCK_ACRONYMS.find((row) => row.slug === slug) ?? null;
  },
);

// ─── Top slugs by volume (build-time prerender set) ──────────
// We prerender only the highest-traffic pages; the long tail renders on demand
// and is cached on first hit. Keeps builds fast and the model scalable.
export async function getTopSlugs(limit: number): Promise<string[]> {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select('slug')
      .eq('is_published', true)
      .eq('is_reviewed', true)
      .order('search_volume_estimate', { ascending: false })
      .limit(limit);
    return (data ?? []).map((r) => r.slug as string);
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql<{ slug: string }[]>`
      select slug from acronyms where is_published and is_reviewed
      order by search_volume_estimate desc limit ${limit}`;
    return rows.map((r) => r.slug);
  }

  return [...MOCK_ACRONYMS]
    .sort((a, b) => b.search_volume_estimate - a.search_volume_estimate)
    .slice(0, limit)
    .map((r) => r.slug);
}

// ─── Latest content change (stable sitemap lastmod) ──────────
// One real timestamp for the whole corpus. Using this instead of `new Date()`
// keeps <lastmod> stable between requests so Google trusts it and doesn't
// needlessly re-crawl unchanged sitemaps. Falls back to now if unavailable.
export const getLatestUpdatedAt = cache(async (): Promise<string> => {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select('updated_at')
      .eq('is_published', true)
      .eq('is_reviewed', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.updated_at) return new Date(data.updated_at as string).toISOString();
  } else if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql<{ m: Date | string | null }[]>`
      select max(updated_at) as m from acronyms
      where is_published and is_reviewed`;
    const m = rows[0]?.m;
    if (m) return (m instanceof Date ? m : new Date(m)).toISOString();
  }
  return new Date().toISOString();
});

// ─── All slugs (sitemaps) ────────────────────────────────────
export async function getAllPublishedSlugs(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select('slug')
      .eq('is_published', true)
      .eq('is_reviewed', true);
    return (data ?? []).map((r) => r.slug as string);
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql<{ slug: string }[]>`
      select slug from acronyms where is_published and is_reviewed`;
    return rows.map((r) => r.slug);
  }

  return MOCK_ACRONYMS.map((row) => row.slug);
}

// ─── Category hub (A–Z + pagination) ─────────────────────────
export async function getAcronymsByCategory(
  category: Category,
  page = 1,
  letter?: string,
): Promise<CategoryListing> {
  let rows: AcronymSummary[];

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select(SUMMARY_COLS)
      .eq('category', category)
      .eq('is_published', true)
      .eq('is_reviewed', true)
      .order('acronym', { ascending: true })
      .limit(5000);
    rows = (data as AcronymSummary[] | null) ?? [];
  } else if (isPgConfigured()) {
    const sql = getSql();
    const result = await sql`
      select acronym, full_form, slug, category from acronyms
      where category = ${category} and is_published and is_reviewed
      order by acronym asc limit 5000`;
    rows = result.map(mapSummary);
  } else {
    rows = MOCK_ACRONYMS.filter((r) => r.category === category)
      .map(toSummary)
      .sort((a, b) => a.acronym.localeCompare(b.acronym));
  }

  const availableLetters = [...new Set(rows.map((r) => azBucket(r.acronym)))];
  const filtered = letter
    ? rows.filter((r) => azBucket(r.acronym) === letter)
    : rows;

  const total = filtered.length;
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * PER_PAGE;
  const items = filtered.slice(start, start + PER_PAGE);

  return { items, total, page: safePage, perPage: PER_PAGE, availableLetters };
}

// ─── Sitemap rows for a category ─────────────────────────────
export interface SitemapRow {
  slug: string;
  updated_at: string;
  search_volume_estimate: number;
}

export async function getSitemapRows(category: Category): Promise<SitemapRow[]> {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select('slug, updated_at, search_volume_estimate')
      .eq('category', category)
      .eq('is_published', true)
      .eq('is_reviewed', true)
      .order('search_volume_estimate', { ascending: false })
      .limit(5000);
    return (data as SitemapRow[] | null) ?? [];
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql`
      select slug, updated_at, search_volume_estimate from acronyms
      where category = ${category} and is_published and is_reviewed
      order by search_volume_estimate desc limit 5000`;
    return rows.map((r) => ({
      slug: String(r.slug),
      updated_at:
        r.updated_at instanceof Date
          ? r.updated_at.toISOString()
          : String(r.updated_at),
      search_volume_estimate: Number(r.search_volume_estimate ?? 0),
    }));
  }

  return MOCK_ACRONYMS.filter((r) => r.category === category)
    .sort((a, b) => b.search_volume_estimate - a.search_volume_estimate)
    .map((r) => ({
      slug: r.slug,
      updated_at: r.updated_at,
      search_volume_estimate: r.search_volume_estimate,
    }));
}

// ─── Resolve related acronyms to linkable summaries ──────────
export async function getRelatedSummaries(
  acronyms: string[],
): Promise<AcronymSummary[]> {
  if (acronyms.length === 0) return [];
  const wanted = acronyms.map((a) => a.toUpperCase());

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select(SUMMARY_COLS)
      .in('acronym', wanted)
      .eq('is_published', true)
      .eq('is_reviewed', true);
    return (data as AcronymSummary[] | null) ?? [];
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql`
      select acronym, full_form, slug, category from acronyms
      where acronym in ${sql(wanted)} and is_published and is_reviewed`;
    return rows.map(mapSummary);
  }

  return wanted
    .map((a) => MOCK_ACRONYMS.find((row) => row.acronym === a))
    .filter((row): row is AcronymRow => Boolean(row))
    .map(toSummary);
}

// ─── Live search (search bar / API) ──────────────────────────
export async function searchAcronyms(
  query: string,
  limit = 10,
): Promise<AcronymSummary[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select(SUMMARY_COLS)
      .eq('is_published', true)
      .eq('is_reviewed', true)
      .or(`acronym.ilike.${q}%,full_form.ilike.%${q}%`)
      .order('search_volume_estimate', { ascending: false })
      .limit(limit);
    return (data as AcronymSummary[] | null) ?? [];
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql`
      select acronym, full_form, slug, category from acronyms
      where is_published and is_reviewed
        and (acronym ilike ${q + '%'} or full_form ilike ${'%' + q + '%'})
      order by search_volume_estimate desc limit ${limit}`;
    return rows.map(mapSummary);
  }

  const needle = q.toLowerCase();
  return [...MOCK_ACRONYMS]
    .filter(
      (r) =>
        r.acronym.toLowerCase().startsWith(needle) ||
        r.full_form.toLowerCase().includes(needle),
    )
    .sort((a, b) => b.search_volume_estimate - a.search_volume_estimate)
    .slice(0, limit)
    .map(toSummary);
}

export { CATEGORY_META };
