-- FullFormHub — initial schema. Run in the Supabase SQL editor (in order).

create extension if not exists "pgcrypto";

-- ─── Core table ──────────────────────────────────────────────
create table if not exists acronyms (
  id uuid primary key default gen_random_uuid(),
  acronym text not null unique,
  full_form text not null,
  category text not null check (category in ('Government','Banking','Education','Medical','Tech','General')),
  description text not null,
  example_usage text,
  hindi_full_form text,
  hindi_description text,
  faq jsonb default '[]'::jsonb,
  related_acronyms text[] default '{}',
  tags text[] default '{}',
  slug text not null unique,
  search_volume_estimate int default 0,
  is_published boolean not null default false,
  is_reviewed boolean not null default false,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Category metadata ───────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  color_hex text not null default '#1e3a5f',
  acronym_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Search analytics ────────────────────────────────────────
create table if not exists search_logs (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  result_count int not null default 0,
  found boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Seed categories (colours match DESIGN.md) ───────────────
insert into categories (slug, name, description, icon, color_hex) values
  ('banking', 'Banking & Finance', 'Full forms of banking, finance, and RBI-related acronyms used across India.', '🏦', '#0F6E5C'),
  ('government', 'Government & Exams', 'Full forms of government bodies, schemes, and competitive exam acronyms.', '🏛️', '#9B2D2D'),
  ('education', 'Education', 'Full forms of boards, entrance exams, and educational institution acronyms.', '📚', '#1F5FA8'),
  ('medical', 'Medical & Health', 'Full forms of medical terms, diseases, and health-organisation acronyms.', '🏥', '#7A2E8F'),
  ('tech', 'Technology', 'Full forms of tech, software, hardware, and internet acronyms.', '💻', '#14627E'),
  ('general', 'General', 'Common everyday acronyms used in India across all domains.', '📖', '#6E5E2F')
on conflict (slug) do nothing;

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists idx_acronyms_slug on acronyms(slug);
create index if not exists idx_acronyms_category on acronyms(category);
create index if not exists idx_acronyms_published_reviewed on acronyms(is_published, is_reviewed);
create index if not exists idx_acronyms_search_volume on acronyms(search_volume_estimate desc);
create index if not exists idx_acronyms_tags on acronyms using gin(tags);
create index if not exists idx_acronyms_faq on acronyms using gin(faq);
create index if not exists idx_search_logs_created on search_logs(created_at desc);

-- Trigram indexes accelerate the ILIKE search the app uses (prefix + contains).
create extension if not exists pg_trgm;
create index if not exists idx_acronyms_acronym_trgm on acronyms using gin (acronym gin_trgm_ops);
create index if not exists idx_acronyms_fullform_trgm on acronyms using gin (full_form gin_trgm_ops);

-- ─── updated_at trigger ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists acronyms_updated_at on acronyms;
create trigger acronyms_updated_at
  before update on acronyms
  for each row execute function update_updated_at();

-- ─── Category count sync ─────────────────────────────────────
create or replace function sync_category_count()
returns trigger as $$
declare
  affected text := lower(coalesce(new.category, old.category));
begin
  update categories
  set acronym_count = (
    select count(*) from acronyms
    where lower(category) = affected
      and is_published = true
      and is_reviewed = true
  )
  where slug = affected;
  return coalesce(new, old);
end;
$$ language plpgsql;

drop trigger if exists acronyms_category_count on acronyms;
create trigger acronyms_category_count
  after insert or update or delete on acronyms
  for each row execute function sync_category_count();

-- ─── Row Level Security ──────────────────────────────────────
alter table acronyms enable row level security;
alter table categories enable row level security;
alter table search_logs enable row level security;

drop policy if exists "public_read_published" on acronyms;
create policy "public_read_published" on acronyms
  for select using (is_published = true and is_reviewed = true);

drop policy if exists "public_read_categories" on categories;
create policy "public_read_categories" on categories
  for select using (true);

-- Writes (inserts to acronyms / search_logs, approvals) use the service-role
-- key, which bypasses RLS. No anon write policy is granted by design.
