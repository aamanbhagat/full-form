// ─── Domain types ────────────────────────────────────────────
// Single source of truth for every shape that crosses a boundary
// (DeepSeek → DB → page). No `any`, ever.

export const CATEGORIES = [
  'Banking',
  'Government',
  'Education',
  'Medical',
  'Tech',
  'Science',
  'Business',
  'Law',
  'Defence',
  'Sports',
  'Organisations',
  'Chat',
  'Slang',
  'General',
  'Country',
  'State',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** URL slug for a category hub, e.g. 'banking'. */
export type CategorySlug =
  | 'banking'
  | 'government'
  | 'education'
  | 'medical'
  | 'tech'
  | 'science'
  | 'business'
  | 'law'
  | 'defence'
  | 'sports'
  | 'organisations'
  | 'chat'
  | 'slang'
  | 'general'
  | 'country'
  | 'state';

// A type alias (not interface) so it is assignable to JSON value types
// (e.g. postgres `sql.json`) without a cast.
export type FaqItem = {
  question: string;
  answer: string;
};

/** The JSON contract DeepSeek must return for one acronym. */
export interface AcronymContent {
  full_form: string;
  category: Category;
  description: string;
  example_usage: string;
  hindi_full_form: string;
  related_acronyms: string[];
  tags: string[];
  meta_description: string;
  faq: FaqItem[];
}

/** A full row of the `acronyms` table. */
export interface AcronymRow {
  id: string;
  acronym: string;
  full_form: string;
  category: Category;
  description: string;
  example_usage: string | null;
  hindi_full_form: string | null;
  hindi_description: string | null;
  faq: FaqItem[];
  related_acronyms: string[];
  tags: string[];
  slug: string;
  search_volume_estimate: number;
  is_published: boolean;
  is_reviewed: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

/** The lightweight projection used in lists, search, and cards. */
export interface AcronymSummary {
  acronym: string;
  full_form: string;
  slug: string;
  category: Category;
}

/** A row of the `categories` table (icon comes from CategoryIcon, not the DB). */
export interface CategoryRow {
  slug: CategorySlug;
  category: Category;
  name: string;
  description: string;
  color_hex: string;
  acronym_count: number;
}

/** Admin-facing review projection. */
export interface AcronymReviewRow {
  id: string;
  acronym: string;
  full_form: string;
  category: Category;
  slug: string;
  is_reviewed: boolean;
  is_published: boolean;
  search_volume_estimate: number;
}
