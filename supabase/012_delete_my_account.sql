-- ============================================================
-- PATCH 10: Let members permanently delete their own profile
-- Run this in the Supabase SQL Editor now.
--
-- delete_my_account() removes the signed-in member's login, profile and
-- everything they authored (articles, discussions, replies). Their
-- challenge responses, applications and likes go with the profile through
-- existing cascades. It can't be pointed at anyone else: it only ever acts
-- on auth.uid().
--
-- Safety rail: the only remaining editor can't delete themselves, so the
-- site is never left with nobody able to review submissions.
-- ============================================================

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  i_am_editor boolean;
  editor_count int;
begin
  if me is null then
    raise exception 'You need to be signed in to delete your profile.';
  end if;

  select (site_role = 'editor') into i_am_editor from profiles where id = me;

  if coalesce(i_am_editor, false) then
    select count(*) into editor_count from profiles where site_role = 'editor';
    if editor_count <= 1 then
      raise exception 'You are the only editor. Make another member an editor before deleting your profile.';
    end if;
  end if;

  -- These three tables reference profiles without a cascade, so clear them first.
  delete from discussion_replies where author_id = me;
  delete from discussions where author_id = me;
  delete from articles where author_id = me;

  -- Removes the login; the profile, responses, applications and likes cascade.
  delete from auth.users where id = me;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Members need to be able to remove their own photo files first. Supabase
-- doesn't delete storage files when a user is deleted, so the app clears them.
create policy "users delete own avatar" on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
