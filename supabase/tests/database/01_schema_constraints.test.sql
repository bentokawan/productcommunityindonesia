begin;
select plan(6);

-- 1. site_settings rejects invalid key
select throws_ok(
  $$insert into public.site_settings (key, value) values ('invalid_key', 'https://example.com')$$,
  '23514',
  null,
  'site_settings rejects unknown key'
);

-- 2. site_settings rejects non-https URL for whatsapp_url
select throws_ok(
  $$insert into public.site_settings (key, value) values ('whatsapp_url', 'http://example.com')$$,
  '23514',
  null,
  'site_settings rejects non-https URL'
);

-- 3. events rejects invalid slug
select throws_ok(
  $$insert into public.events (slug, category_id, edition_label, title, speakers, poster_path, starts_at, instagram_url)
    values ('Invalid Slug!', (select id from public.event_categories limit 1), '#1', 'Test', 'Speaker', 'events/a.png', now(), 'https://www.instagram.com/p/123/')$$,
  '23514',
  null,
  'events rejects invalid slug'
);

-- 4. events rejects non-instagram URL
select throws_ok(
  $$insert into public.events (slug, category_id, edition_label, title, speakers, poster_path, starts_at, instagram_url)
    values ('valid-slug-test', (select id from public.event_categories limit 1), '#1', 'Test', 'Speaker', 'events/a.png', now(), 'https://example.com/123')$$,
  '23514',
  null,
  'events rejects non-instagram URL'
);

-- 5. event_categories restricts delete when referenced by events
select throws_ok(
  $$delete from public.event_categories where slug = 'sharing-session'$$,
  '23503',
  null,
  'event_categories delete restricted when events exist'
);

-- 6. hero_slides rejects path traversal
select throws_ok(
  $$insert into public.hero_slides (image_path, alt, caption) values ('../secret.png', 'Alt', 'Caption')$$,
  '23514',
  null,
  'hero_slides rejects path traversal'
);

select * from finish();
rollback;
