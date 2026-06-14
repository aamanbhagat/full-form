import postgres, { type Sql } from 'postgres';
import type { AcronymRow, AcronymSummary, FaqItem } from '@/types';

// Direct Postgres path. Used when SUPABASE_DB_URL (the pooled connection string)
// is set but the Supabase REST keys are not — lets the app read and write the
// real database with just the connection string. Server-only.
const url = process.env.SUPABASE_DB_URL;

export function isPgConfigured(): boolean {
  return Boolean(url);
}

// Reuse one pool across HMR reloads in dev and across requests in prod.
const globalForPg = globalThis as unknown as { _ffhSql?: Sql };

export function getSql(): Sql {
  if (!url) throw new Error('SUPABASE_DB_URL is not set.');
  if (!globalForPg._ffhSql) {
    globalForPg._ffhSql = postgres(url, {
      ssl: 'require',
      prepare: false, // required for the Supabase transaction pooler (pgbouncer)
      // Sized to the build's per-worker page concurrency (next.config.ts) so
      // prerender queries never queue on too few connections, while staying well
      // under the shared pooler's limit.
      max: 8,
      connect_timeout: 30,
    });
  }
  return globalForPg._ffhSql;
}

type Row = Record<string, unknown>;

function toIso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return typeof v === 'string' ? v : new Date().toISOString();
}

export function mapAcronymRow(r: Row): AcronymRow {
  return {
    id: String(r.id),
    acronym: String(r.acronym),
    full_form: String(r.full_form),
    category: r.category as AcronymRow['category'],
    description: String(r.description),
    example_usage: (r.example_usage as string | null) ?? null,
    hindi_full_form: (r.hindi_full_form as string | null) ?? null,
    hindi_description: (r.hindi_description as string | null) ?? null,
    faq: (r.faq as FaqItem[] | null) ?? [],
    related_acronyms: (r.related_acronyms as string[] | null) ?? [],
    tags: (r.tags as string[] | null) ?? [],
    slug: String(r.slug),
    search_volume_estimate: Number(r.search_volume_estimate ?? 0),
    is_published: Boolean(r.is_published),
    is_reviewed: Boolean(r.is_reviewed),
    meta_title: (r.meta_title as string | null) ?? null,
    meta_description: (r.meta_description as string | null) ?? null,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

export function mapSummary(r: Row): AcronymSummary {
  return {
    acronym: String(r.acronym),
    full_form: String(r.full_form),
    slug: String(r.slug),
    category: r.category as AcronymSummary['category'],
  };
}
