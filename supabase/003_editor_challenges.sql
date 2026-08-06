-- ============================================================
-- PATCH 2: Let Editors add challenges through the app
-- Run this in the Supabase SQL Editor now.
-- Previously challenges could only be added by running SQL by hand;
-- this lets the new /review/challenges page work.
-- ============================================================

create policy "editors insert challenges" on challenges for insert
  with check (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));
