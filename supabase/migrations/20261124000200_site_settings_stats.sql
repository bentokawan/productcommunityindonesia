-- T-01 site_settings & T-02 site_stats

create table public.site_settings (
  key text primary key
    check (key in ('whatsapp_url', 'instagram_url', 'instagram_handle', 'linkedin_url')),
  value text not null
    check (char_length(btrim(value)) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_url_check check (
    key not in ('whatsapp_url', 'instagram_url', 'linkedin_url')
    or value ~ '^https://'
  )
);

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function private.set_updated_at();

alter table public.site_settings enable row level security;

create policy site_settings_select_public on public.site_settings
  for select to anon
  using (true);

comment on table public.site_settings is 'T-01: Global site links and social handles';

create table public.site_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null
    check (char_length(btrim(value)) between 1 and 8),
  label text not null
    check (char_length(btrim(label)) between 1 and 60),
  sort_order int not null default 0
    check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_stats_sort_idx on public.site_stats (sort_order asc, created_at asc);

create trigger set_site_stats_updated_at
  before update on public.site_stats
  for each row execute function private.set_updated_at();

alter table public.site_stats enable row level security;

create policy site_stats_select_public on public.site_stats
  for select to anon
  using (true);

comment on table public.site_stats is 'T-02: Hero section statistics';
