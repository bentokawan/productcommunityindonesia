-- CMS write & staff select RLS policies for T-01 .. T-11

-- T-01 site_settings: staff read, admin upsert (insert + update)
create policy site_settings_select_staff on public.site_settings
  for select to authenticated
  using ((select private.is_staff()));

create policy site_settings_insert_admin on public.site_settings
  for insert to authenticated
  with check ((select private.is_admin()));

create policy site_settings_update_admin on public.site_settings
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- T-02 site_stats: staff full CRUD
create policy site_stats_select_staff on public.site_stats
  for select to authenticated
  using ((select private.is_staff()));

create policy site_stats_write_staff on public.site_stats
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-03 hero_slides: staff full CRUD (including unpublished)
create policy hero_slides_select_staff on public.hero_slides
  for select to authenticated
  using ((select private.is_staff()));

create policy hero_slides_write_staff on public.hero_slides
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-04 partners: staff full CRUD
create policy partners_select_staff on public.partners
  for select to authenticated
  using ((select private.is_staff()));

create policy partners_write_staff on public.partners
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-05 activities: staff full CRUD
create policy activities_select_staff on public.activities
  for select to authenticated
  using ((select private.is_staff()));

create policy activities_write_staff on public.activities
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-06 community_groups: staff full CRUD
create policy community_groups_select_staff on public.community_groups
  for select to authenticated
  using ((select private.is_staff()));

create policy community_groups_write_staff on public.community_groups
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-08 event_categories: staff read, admin write
create policy event_categories_select_staff on public.event_categories
  for select to authenticated
  using ((select private.is_staff()));

create policy event_categories_write_admin on public.event_categories
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- T-07 events: staff full CRUD (including unpublished)
create policy events_select_staff on public.events
  for select to authenticated
  using ((select private.is_staff()));

create policy events_write_staff on public.events
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-10 team_members: staff full CRUD (including unpublished)
create policy team_members_select_staff on public.team_members
  for select to authenticated
  using ((select private.is_staff()));

create policy team_members_write_staff on public.team_members
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- T-11 faqs: staff full CRUD (including unpublished)
create policy faqs_select_staff on public.faqs
  for select to authenticated
  using ((select private.is_staff()));

create policy faqs_write_staff on public.faqs
  for all to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));
