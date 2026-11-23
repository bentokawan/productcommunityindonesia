-- T-03 hero_slides

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_path text not null
    check (char_length(btrim(image_path)) between 1 and 300 and image_path !~ '^/' and image_path !~ '\.\.'),
  alt text not null
    check (char_length(btrim(alt)) between 1 and 200),
  caption text not null
    check (char_length(btrim(caption)) between 1 and 40),
  caption_long text
    check (caption_long is null or char_length(btrim(caption_long)) between 1 and 80),
  sort_order int not null default 0
    check (sort_order >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hero_slides_published_sort_idx
  on public.hero_slides (is_published, sort_order asc, created_at asc);

create trigger set_hero_slides_updated_at
  before update on public.hero_slides
  for each row execute function private.set_updated_at();

alter table public.hero_slides enable row level security;

create policy hero_slides_select_public on public.hero_slides
  for select to anon
  using (is_published);

comment on table public.hero_slides is 'T-03: Hero carousel slides';
