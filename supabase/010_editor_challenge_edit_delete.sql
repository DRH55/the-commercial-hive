-- ============================================================
-- PATCH 8: Let editors edit and remove challenges
-- Run this in the Supabase SQL Editor now.
-- Applies to all challenges, existing and future, not just ones a
-- given editor created themselves.
-- ============================================================

create policy "editors update challenges" on challenges for update
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));

create policy "editors delete challenges" on challenges for delete
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));
