-- ============================================================
-- PATCH 1: Close the self-promotion security gap
-- Run this in the Supabase SQL Editor now.
-- Prevents any signed-in user from granting themselves Editor
-- access or a contributor tier via the app — only an existing
-- Editor (through the app) or you directly (via Table Editor /
-- SQL Editor) can change these fields going forward.
-- ============================================================

create or replace function public.prevent_self_role_escalation()
returns trigger as $$
declare
  requester_is_editor boolean;
begin
  -- auth.uid() is null when the change comes from you directly via the
  -- Supabase dashboard (Table Editor / SQL Editor) — that's always allowed.
  if auth.uid() is not null then
    select (site_role = 'editor') into requester_is_editor
    from public.profiles where id = auth.uid();

    if not coalesce(requester_is_editor, false) then
      if new.site_role is distinct from old.site_role then
        new.site_role := old.site_role;
      end if;
      if new.contributor_tier is distinct from old.contributor_tier then
        new.contributor_tier := old.contributor_tier;
      end if;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists prevent_role_escalation on profiles;
create trigger prevent_role_escalation
  before update on profiles
  for each row execute procedure public.prevent_self_role_escalation();

-- Let Editors update OTHER people's profiles too (needed so an Editor can
-- accept a contributor application and assign someone a tier).
create policy "editors update any profile" on profiles for update
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));

-- Let Editors act on (accept/decline) contributor applications.
create policy "editors update applications" on applications for update
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));
