-- T-04 partners, T-05 activities, T-06 community_groups

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
    check (char_length(btrim(name)) between 1 and 60),
  url text
    check (url is null or url ~ '^https://'),
  sort_order int not null default 0
    check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partners_sort_idx on public.partners (sort_order asc, created_at asc);

create trigger set_partners_updated_at
  before update on public.partners
  for each row execute function private.set_updated_at();

alter table public.partners enable row level security;

create policy partners_select_public on public.partners
  for select to anon
  using (true);

comment on table public.partners is 'T-04: Community collaboration partners';

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  emoji text not null
    check (char_length(btrim(emoji)) between 1 and 8),
  title text not null
    check (char_length(btrim(title)) between 1 and 60),
  description text not null
    check (char_length(btrim(description)) between 1 and 200),
  sort_order int not null default 0
    check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index activities_sort_idx on public.activities (sort_order asc, created_at asc);

create trigger set_activities_updated_at
  before update on public.activities
  for each row execute function private.set_updated_at();

alter table public.activities enable row level security;

create policy activities_select_public on public.activities
  for select to anon
  using (true);

comment on table public.activities is 'T-05: Community activity cards';

create table public.community_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
    check (char_length(btrim(name)) between 1 and 60),
  description text not null
    check (char_length(btrim(description)) between 1 and 200),
  logo_path text not null
    check (char_length(btrim(logo_path)) between 1 and 300 and logo_path !~ '^/' and logo_path !~ '\.\.'),
  sort_order int not null default 0
    check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index community_groups_sort_idx on public.community_groups (sort_order asc, created_at asc);

create trigger set_community_groups_updated_at
  before update on public.community_groups
  for each row execute function private.set_updated_at();

alter table public.community_groups enable row level security;

create policy community_groups_select_public on public.community_groups
  for select to anon
  using (true);

comment on table public.community_groups is 'T-06: Sub-groups inside the community';
