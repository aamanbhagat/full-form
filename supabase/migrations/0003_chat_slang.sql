-- Add two browse categories: Chat & Texting, Slang & Internet (12 → 14).

alter table acronyms drop constraint if exists acronyms_category_check;
alter table acronyms add constraint acronyms_category_check
  check (category in (
    'Government','Banking','Education','Medical','Tech','Science',
    'Business','Law','Defence','Sports','Organisations','Chat','Slang','General'
  ));

insert into categories (slug, name, description, icon, color_hex) values
  ('chat', 'Chat & Texting', 'Full forms of texting and messaging shorthand — BRB, GTG, TTYL, IMO, and the rest.', '', '#C2255C'),
  ('slang', 'Slang & Internet', 'Full forms of internet slang and social-media lingo — LOL, LMAO, YOLO, FOMO, GOAT.', '', '#6741D9')
on conflict (slug) do nothing;
