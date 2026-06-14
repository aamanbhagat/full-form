import { generateAcronymContent } from '@/lib/llm';
import { acronymSlug } from '@/lib/slug';
import {
  createServiceSupabaseClient,
  isSupabaseServiceConfigured,
} from '@/lib/supabase-server';
import { getSql, isPgConfigured } from '@/lib/pg';
import type { AcronymContent } from '@/types';

export interface ProcessResult {
  acronym: string;
  status: 'ok' | 'skipped' | 'mock' | 'error';
  message?: string;
  content?: AcronymContent;
}

// One acronym, end to end: generate → (optionally) persist as unpublished.
// Shared by POST /api/generate and scripts/generate-content.ts so the two paths
// can never drift. Persists via Supabase REST when keys exist, else direct
// Postgres, else returns the draft without saving (mock mode).
export async function processAcronym(acronym: string): Promise<ProcessResult> {
  const clean = acronym.trim().toUpperCase();
  if (!clean) return { acronym, status: 'error', message: 'empty acronym' };

  const slug = acronymSlug(clean);

  try {
    if (isSupabaseServiceConfigured()) {
      const supabase = createServiceSupabaseClient();
      const { data: existing } = await supabase
        .from('acronyms')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (existing) return { acronym: clean, status: 'skipped' };

      const content = await generateAcronymContent(clean);
      const { error } = await supabase.from('acronyms').insert({
        acronym: clean,
        full_form: content.full_form,
        category: content.category,
        description: content.description,
        example_usage: content.example_usage,
        hindi_full_form: content.hindi_full_form,
        faq: content.faq,
        related_acronyms: content.related_acronyms,
        tags: content.tags,
        slug,
        meta_description: content.meta_description,
        is_published: false,
        is_reviewed: false,
      });
      if (error) throw new Error(error.message);
      return { acronym: clean, status: 'ok', content };
    }

    if (isPgConfigured()) {
      const sql = getSql();
      const existing = await sql`select id from acronyms where slug = ${slug} limit 1`;
      if (existing.length > 0) return { acronym: clean, status: 'skipped' };

      const content = await generateAcronymContent(clean);
      await sql`insert into acronyms (
        acronym, full_form, category, description, example_usage,
        hindi_full_form, faq, related_acronyms, tags, slug,
        meta_description, is_published, is_reviewed
      ) values (
        ${clean}, ${content.full_form}, ${content.category}, ${content.description},
        ${content.example_usage}, ${content.hindi_full_form}, ${sql.json(content.faq)},
        ${content.related_acronyms}, ${content.tags}, ${slug},
        ${content.meta_description}, false, false
      )`;
      return { acronym: clean, status: 'ok', content };
    }

    // No persistence configured → return the draft for preview.
    const content = await generateAcronymContent(clean);
    return { acronym: clean, status: 'mock', content };
  } catch (err) {
    return {
      acronym: clean,
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
