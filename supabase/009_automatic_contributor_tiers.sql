-- ============================================================
-- PATCH 7: Automatic contributor tiers
-- Run this in the Supabase SQL Editor now.
-- Tiers are now earned automatically from published article count,
-- not assigned by an editor:
--   1 published article  -> Guest Contributor
--   3 published articles -> Monthly Contributor
--   8 published articles -> Weekly Contributor
-- ============================================================

create or replace function public.recalc_contributor_tier()
returns trigger as $$
declare
  target_author uuid;
  published_count int;
  new_tier text;
begin
  target_author := coalesce(new.author_id, old.author_id);

  select count(*) into published_count from articles
  where author_id = target_author and status = 'published';

  if published_count >= 8 then
    new_tier := 'Weekly Contributor';
  elsif published_count >= 3 then
    new_tier := 'Monthly Contributor';
  elsif published_count >= 1 then
    new_tier := 'Guest Contributor';
  else
    new_tier := null;
  end if;

  -- Marks this as a trusted system update so the self-escalation guard
  -- (see 002_security_patch.sql) lets the contributor_tier change through.
  perform set_config('app.recalculating_tier', 'true', true);
  update profiles set contributor_tier = new_tier
  where id = target_author and contributor_tier is distinct from new_tier;
  perform set_config('app.recalculating_tier', 'false', true);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_article_status_change on articles;
create trigger on_article_status_change
  after insert or update of status on articles
  for each row execute procedure public.recalc_contributor_tier();

-- Let the trusted automatic-tier update above through the escalation guard.
create or replace function public.prevent_self_role_escalation()
returns trigger as $$
declare
  requester_is_editor boolean;
begin
  if current_setting('app.recalculating_tier', true) = 'true' then
    return new;
  end if;

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

-- Backfill: apply the new automatic tiers to everyone based on their
-- existing published article counts right now.
do $$
declare
  r record;
  published_count int;
  new_tier text;
begin
  for r in select id from profiles loop
    select count(*) into published_count from articles where author_id = r.id and status = 'published';
    if published_count >= 8 then
      new_tier := 'Weekly Contributor';
    elsif published_count >= 3 then
      new_tier := 'Monthly Contributor';
    elsif published_count >= 1 then
      new_tier := 'Guest Contributor';
    else
      new_tier := null;
    end if;
    update profiles set contributor_tier = new_tier where id = r.id and contributor_tier is distinct from new_tier;
  end loop;
end $$;
