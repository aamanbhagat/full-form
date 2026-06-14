import 'server-only';
import type { AcronymReviewRow, Category } from '@/types';
import { CATEGORIES } from '@/types';
import { MOCK_ACRONYMS } from '@/lib/mock-data';
import {
  createServiceSupabaseClient,
  isSupabaseServiceConfigured,
} from '@/lib/supabase-server';
import { getSql, isPgConfigured } from '@/lib/pg';

export interface AdminStats {
  total: number;
  published: number;
  pending: number;
  byCategory: Record<Category, number>;
}

export type AdminFilter = 'all' | 'pending' | 'published';

/** True when the admin can actually write (Supabase service key or direct PG). */
export function adminIsLive(): boolean {
  return isSupabaseServiceConfigured() || isPgConfigured();
}

function emptyCounts(): Record<Category, number> {
  return Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<
    Category,
    number
  >;
}

export async function getAdminStats(): Promise<AdminStats> {
  const byCategory = emptyCounts();

  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceSupabaseClient();
    const { data } = await supabase
      .from('acronyms')
      .select('category, is_published, is_reviewed');
    const rows = data ?? [];
    let published = 0;
    for (const r of rows) {
      byCategory[r.category as Category] += 1;
      if (r.is_published && r.is_reviewed) published += 1;
    }
    return { total: rows.length, published, pending: rows.length - published, byCategory };
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const rows = await sql<
      { category: Category; live: boolean }[]
    >`select category, (is_published and is_reviewed) as live from acronyms`;
    let published = 0;
    for (const r of rows) {
      byCategory[r.category] += 1;
      if (r.live) published += 1;
    }
    return { total: rows.length, published, pending: rows.length - published, byCategory };
  }

  for (const r of MOCK_ACRONYMS) byCategory[r.category] += 1;
  return {
    total: MOCK_ACRONYMS.length,
    published: MOCK_ACRONYMS.length,
    pending: 0,
    byCategory,
  };
}

const REVIEW_COLS =
  'id, acronym, full_form, category, slug, is_reviewed, is_published, search_volume_estimate';

export async function getAdminRows(
  filter: AdminFilter = 'all',
): Promise<AcronymReviewRow[]> {
  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceSupabaseClient();
    let query = supabase
      .from('acronyms')
      .select(REVIEW_COLS)
      .order('created_at', { ascending: false })
      .limit(200);
    if (filter === 'pending') query = query.eq('is_published', false);
    if (filter === 'published') query = query.eq('is_published', true);
    const { data } = await query;
    return (data as AcronymReviewRow[] | null) ?? [];
  }

  if (isPgConfigured()) {
    const sql = getSql();
    const where =
      filter === 'pending'
        ? sql`where is_published = false`
        : filter === 'published'
          ? sql`where is_published = true`
          : sql``;
    const rows = await sql`
      select id, acronym, full_form, category, slug, is_reviewed, is_published, search_volume_estimate
      from acronyms ${where} order by created_at desc limit 200`;
    return rows.map((r) => ({
      id: String(r.id),
      acronym: String(r.acronym),
      full_form: String(r.full_form),
      category: r.category as Category,
      slug: String(r.slug),
      is_reviewed: Boolean(r.is_reviewed),
      is_published: Boolean(r.is_published),
      search_volume_estimate: Number(r.search_volume_estimate ?? 0),
    }));
  }

  return MOCK_ACRONYMS.map((r) => ({
    id: r.id,
    acronym: r.acronym,
    full_form: r.full_form,
    category: r.category,
    slug: r.slug,
    is_reviewed: r.is_reviewed,
    is_published: r.is_published,
    search_volume_estimate: r.search_volume_estimate,
  }));
}
