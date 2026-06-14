-- Expand the category set from 6 to 12.

alter table acronyms drop constraint if exists acronyms_category_check;
alter table acronyms add constraint acronyms_category_check
  check (category in (
    'Government','Banking','Education','Medical','Tech','Science',
    'Business','Law','Defence','Sports','Organisations','General'
  ));

insert into categories (slug, name, description, icon, color_hex) values
  ('science', 'Science', 'Full forms from physics, chemistry, biology, space, and research.', '', '#2A7030'),
  ('business', 'Business & Corporate', 'Full forms of management, corporate, marketing, and workplace acronyms.', '', '#9E5512'),
  ('law', 'Law & Legal', 'Full forms of courts, acts, and legal-procedure acronyms used in India.', '', '#3E4C9A'),
  ('defence', 'Defence & Police', 'Full forms of the armed forces, paramilitary, and police acronyms.', '', '#4F5E2A'),
  ('sports', 'Sports', 'Full forms of games, tournaments, and sporting-body acronyms.', '', '#8A6D1F'),
  ('organisations', 'Organisations', 'Full forms of companies, PSUs, and well-known Indian and global bodies.', '', '#5C6470')
on conflict (slug) do nothing;
