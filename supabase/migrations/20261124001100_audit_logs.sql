-- T-15 audit_logs and change logging trigger

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index audit_logs_table_record_idx on public.audit_logs (table_name, record_id);

alter table public.audit_logs enable row level security;

create policy audit_logs_select_admin on public.audit_logs
  for select to authenticated
  using ((select private.is_admin()));

comment on table public.audit_logs is 'T-15: Append-only CMS change log';

create or replace function private.log_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_record_id text;
  v_old jsonb;
  v_new jsonb;
begin
  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
    v_record_id := coalesce(v_new ->> 'id', v_new ->> 'key', v_new ->> 'user_id', '');
  elsif tg_op = 'UPDATE' then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_record_id := coalesce(v_new ->> 'id', v_new ->> 'key', v_new ->> 'user_id', '');
  elsif tg_op = 'DELETE' then
    v_old := to_jsonb(old);
    v_record_id := coalesce(v_old ->> 'id', v_old ->> 'key', v_old ->> 'user_id', '');
  end if;

  insert into public.audit_logs (actor_id, table_name, record_id, action, old_data, new_data)
  values (
    auth.uid(),
    tg_table_name,
    v_record_id,
    lower(tg_op),
    v_old,
    v_new
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger site_settings_audit after insert or update or delete on public.site_settings
  for each row execute function private.log_change();
create trigger site_stats_audit after insert or update or delete on public.site_stats
  for each row execute function private.log_change();
create trigger hero_slides_audit after insert or update or delete on public.hero_slides
  for each row execute function private.log_change();
create trigger partners_audit after insert or update or delete on public.partners
  for each row execute function private.log_change();
create trigger activities_audit after insert or update or delete on public.activities
  for each row execute function private.log_change();
create trigger community_groups_audit after insert or update or delete on public.community_groups
  for each row execute function private.log_change();
create trigger event_categories_audit after insert or update or delete on public.event_categories
  for each row execute function private.log_change();
create trigger events_audit after insert or update or delete on public.events
  for each row execute function private.log_change();
create trigger team_members_audit after insert or update or delete on public.team_members
  for each row execute function private.log_change();
create trigger faqs_audit after insert or update or delete on public.faqs
  for each row execute function private.log_change();
create trigger profiles_audit after insert or update or delete on public.profiles
  for each row execute function private.log_change();
