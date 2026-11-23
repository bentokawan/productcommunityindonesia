-- T-08 event_categories & T-07 events

create table public.event_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 40),
  name text not null
    check (char_length(btrim(name)) between 1 and 40),
  sort_order int not null default 0
    check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index event_categories_sort_idx on public.event_categories (sort_order asc, created_at asc);

create trigger set_event_categories_updated_at
  before update on public.event_categories
  for each row execute function private.set_updated_at();

alter table public.event_categories enable row level security;

create policy event_categories_select_public on public.event_categories
  for select to anon
  using (true);

comment on table public.event_categories is 'T-08: Webinar categories';

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  category_id uuid not null
    references public.event_categories (id) on delete restrict,
  edition_label text not null
    check (char_length(btrim(edition_label)) between 1 and 40),
  title text not null
    check (char_length(btrim(title)) between 1 and 140),
  speakers text not null
    check (char_length(btrim(speakers)) between 1 and 200),
  poster_path text not null
    check (char_length(btrim(poster_path)) between 1 and 300 and poster_path !~ '^/' and poster_path !~ '\.\.'),
  starts_at timestamptz not null,
  instagram_url text not null
    check (instagram_url like 'https://www.instagram.com/%' and char_length(instagram_url) <= 500),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_category_id_idx on public.events (category_id);
create index events_published_starts_idx on public.events (is_published, starts_at desc);

create trigger set_events_updated_at
  before update on public.events
  for each row execute function private.set_updated_at();

alter table public.events enable row level security;

create policy events_select_public on public.events
  for select to anon
  using (is_published);

comment on table public.events is 'T-07: Webinar & sharing session archive';
