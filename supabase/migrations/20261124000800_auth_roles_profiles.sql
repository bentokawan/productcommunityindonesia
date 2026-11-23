-- T-14 profiles, app_role enum, RBAC helpers, and last-admin guard

create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null,
  full_name text not null
    check (char_length(btrim(full_name)) between 1 and 80),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

create or replace function private.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.user_id = (select auth.uid())
    and p.is_active = true
$$;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.current_app_role() is not null
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.current_app_role() = 'admin'::public.app_role
$$;

grant usage on schema private to authenticated;
revoke execute on all functions in schema private from public, anon;
grant execute on function private.current_app_role(), private.is_staff(), private.is_admin() to authenticated;

create or replace function private.guard_last_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_demoting boolean;
begin
  if old.role = 'admin'::public.app_role and old.is_active = true then
    is_demoting := (tg_op = 'DELETE')
      or (new.role <> 'admin'::public.app_role)
      or (new.is_active = false);

    if is_demoting and not exists (
      select 1
      from public.profiles p
      where p.user_id <> old.user_id
        and p.role = 'admin'::public.app_role
        and p.is_active = true
    ) then
      raise exception 'Tidak dapat menurunkan atau menonaktifkan admin aktif terakhir.'
        using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_last_admin
  before update or delete on public.profiles
  for each row execute function private.guard_last_admin();

alter table public.profiles enable row level security;

create policy profiles_select_self_or_admin on public.profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy profiles_insert_admin on public.profiles
  for insert to authenticated
  with check ((select private.is_admin()));

create policy profiles_update_admin on public.profiles
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and role = (select private.current_app_role())
    and is_active = true
  );

create policy profiles_delete_admin on public.profiles
  for delete to authenticated
  using ((select private.is_admin()));

comment on table public.profiles is 'T-14: CMS user roles and active status';
