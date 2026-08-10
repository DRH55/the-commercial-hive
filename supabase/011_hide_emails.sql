-- ============================================================
-- PATCH 9: Stop exposing every member's email publicly
-- Run this in the Supabase SQL Editor now.
-- Until now, the "profiles are public" policy meant anyone (including
-- logged-out visitors) could read every member's email directly through
-- the API, even though the site itself never displayed it. This revokes
-- email at the column level so no request, from the app or otherwise,
-- can pull it in bulk. Two narrow, purpose-built functions let editors
-- (Members page) and the like-notification route keep working.
-- ============================================================

revoke select (email) on profiles from anon, authenticated;

create or replace function public.list_members()
returns setof profiles as $$
  select * from profiles
  where exists (select 1 from profiles p where p.id = auth.uid() and p.site_role = 'editor');
$$ language sql security definer stable;

grant execute on function public.list_members() to authenticated;

create or replace function public.get_notify_email(target_id uuid)
returns text as $$
  select email from profiles where id = target_id;
$$ language sql security definer stable;

grant execute on function public.get_notify_email(uuid) to anon, authenticated;
