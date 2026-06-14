-- Fix sync_category_count(): the old version ran `select count(*) from
-- acronyms where category = ...` on EVERY row-level trigger invocation.
-- A bulk `update acronyms set is_published = true` over ~15k rows therefore
-- ran ~15k full category counts (O(n^2)), which is what caused
-- "canceling statement due to statement timeout" in `npm run approve`.
--
-- Replace it with an O(1) incremental counter that just adjusts
-- acronym_count by +1/-1 per row.

create or replace function sync_category_count()
returns trigger as $$
declare
  was_counted boolean;
  is_counted boolean;
begin
  if tg_op = 'INSERT' then
    if new.is_published and new.is_reviewed then
      update categories set acronym_count = acronym_count + 1 where slug = lower(new.category);
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.is_published and old.is_reviewed then
      update categories set acronym_count = acronym_count - 1 where slug = lower(old.category);
    end if;
    return old;
  else
    was_counted := old.is_published and old.is_reviewed;
    is_counted := new.is_published and new.is_reviewed;

    if was_counted and not is_counted then
      update categories set acronym_count = acronym_count - 1 where slug = lower(old.category);
    elsif is_counted and not was_counted then
      update categories set acronym_count = acronym_count + 1 where slug = lower(new.category);
    elsif is_counted and was_counted and lower(old.category) <> lower(new.category) then
      update categories set acronym_count = acronym_count - 1 where slug = lower(old.category);
      update categories set acronym_count = acronym_count + 1 where slug = lower(new.category);
    end if;
    return new;
  end if;
end;
$$ language plpgsql;

-- ─── Register Country / State (added to lib/categories.ts but never migrated) ───
alter table acronyms drop constraint if exists acronyms_category_check;
alter table acronyms add constraint acronyms_category_check
  check (category in (
    'Government','Banking','Education','Medical','Tech','Science',
    'Business','Law','Defence','Sports','Organisations','Chat','Slang',
    'General','Country','State'
  ));

insert into categories (slug, name, description, icon, color_hex) values
  ('country', 'Countries', 'Country codes, international abbreviations, and global organisation acronyms.', '', '#D14D0A'),
  ('state', 'States & Provinces', 'Full forms of states, provinces, and territories from India and around the world.', '', '#FF7F50')
on conflict (slug) do nothing;

-- One-off resync so counts are correct under the new (and old, now-dormant) logic.
update categories c
set acronym_count = (
  select count(*) from acronyms a
  where lower(a.category) = c.slug
    and a.is_published = true
    and a.is_reviewed = true
);
