insert into public.partners (name, url, sort_order)
values
  ('Riung Connect', null, 1),
  ('Indonesia Product Conference', null, 2),
  ('Bisain.', null, 3),
  ('Coptera', null, 4),
  ('rubythalib.ai', null, 5)
on conflict (name) do nothing;
