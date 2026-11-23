-- Storage policies for bucket 'media' (staff upload/update/delete restricted to allowed folders)

create policy media_insert_staff on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (select private.is_staff())
    and (storage.foldername(name))[1] in ('hero', 'events', 'groups', 'team')
  );

create policy media_update_staff on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and (select private.is_staff())
  )
  with check (
    bucket_id = 'media'
    and (select private.is_staff())
    and (storage.foldername(name))[1] in ('hero', 'events', 'groups', 'team')
  );

create policy media_delete_staff on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and (select private.is_staff())
    and (storage.foldername(name))[1] in ('hero', 'events', 'groups', 'team')
  );
