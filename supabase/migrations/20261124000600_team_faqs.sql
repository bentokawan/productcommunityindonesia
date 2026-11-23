-- T-10 team_members & T-11 faqs

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(btrim(name)) between 1 and 60),
  role text not null
    check (char_length(btrim(role)) between 1 and 60),
  photo_path text not null
    check (char_length(btrim(photo_path)) between 1 and 300 and photo_path !~ '^/' and photo_path !~ '\.\.'),
  linkedin_url text
    check (linkedin_url is null or linkedin_url ~ '^https://'),
  sort_order int not null default 0
    check (sort_order >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index team_members_published_sort_idx
  on public.team_members (is_published, sort_order asc, created_at asc);

create trigger set_team_members_updated_at
  before update on public.team_members
  for each row execute function private.set_updated_at();

alter table public.team_members enable row level security;

create policy team_members_select_public on public.team_members
  for select to anon
  using (is_published);

comment on table public.team_members is 'T-10: Community core team members';

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null
    check (char_length(btrim(question)) between 1 and 160),
  answer text not null
    check (char_length(btrim(answer)) between 1 and 1000),
  sort_order int not null default 0
    check (sort_order >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_published_sort_idx
  on public.faqs (is_published, sort_order asc, created_at asc);

create trigger set_faqs_updated_at
  before update on public.faqs
  for each row execute function private.set_updated_at();

alter table public.faqs enable row level security;

create policy faqs_select_public on public.faqs
  for select to anon
  using (is_published);

comment on table public.faqs is 'T-11: Frequently asked questions';
