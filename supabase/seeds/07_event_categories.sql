insert into public.event_categories (slug, name, sort_order)
values
  ('sharing-session', 'Sharing Session', 1),
  ('riung-class', 'Riung Class', 2)
on conflict (slug) do nothing;
