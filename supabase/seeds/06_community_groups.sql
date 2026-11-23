insert into public.community_groups (name, description, logo_path, sort_order)
values
  ('Job Akses', 'Info lowongan kerja di bidang product.', 'placeholders/group-1.svg', 1),
  ('Akses Belajar', 'Sharing materi dan resource belajar.', 'placeholders/group-2.svg', 2),
  ('Bagi-Bagi Project', 'Info project dan peluang kolaborasi.', 'placeholders/group-3.svg', 3),
  ('Forum Jual Beli', 'Jual beli antar member komunitas.', 'placeholders/group-4.svg', 4)
on conflict (name) do nothing;
