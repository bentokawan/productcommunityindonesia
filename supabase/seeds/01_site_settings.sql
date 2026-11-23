insert into public.site_settings (key, value)
values
  ('whatsapp_url', 'https://chat.whatsapp.com/productcommunityid'),
  ('instagram_url', 'https://www.instagram.com/productcommunityid/'),
  ('instagram_handle', '@productcommunityid'),
  ('linkedin_url', 'https://www.linkedin.com/company/productcommunityid/')
on conflict (key) do nothing;
