begin;
select plan(6);

-- Insert an unpublished faq as postgres before switching to anon
insert into public.faqs (question, answer, sort_order, is_published)
values ('Draft FAQ?', 'Hidden answer', 99, false);

set local role anon;

-- 1. anon can read published faqs
select cmp_ok(
  (select count(*)::int from public.faqs where is_published = true),
  '>=',
  4,
  'anon can read published faqs'
);

-- 2. anon cannot read unpublished faqs
select is(
  (select count(*)::int from public.faqs where is_published = false),
  0,
  'anon cannot read unpublished faqs'
);

-- 3. anon cannot insert into faqs
select throws_ok(
  $$insert into public.faqs (question, answer) values ('Hack?', 'No')$$,
  '42501',
  null,
  'anon cannot insert into faqs'
);

-- 4. anon cannot update site_settings
select throws_ok(
  $$update public.site_settings set value = 'https://evil.example.com' where key = 'whatsapp_url'$$,
  '42501',
  null,
  'anon cannot update site_settings'
);

-- 5. anon cannot delete events
select throws_ok(
  $$delete from public.events$$,
  '42501',
  null,
  'anon cannot delete events'
);

-- 6. anon cannot access private schema functions
select throws_ok(
  $$select private.set_updated_at()$$,
  '42501',
  null,
  'anon cannot access private schema'
);

select * from finish();
rollback;
