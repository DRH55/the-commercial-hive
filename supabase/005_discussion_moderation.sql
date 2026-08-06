-- ============================================================
-- PATCH 3: Let Editors remove discussions and replies
-- Run this in the Supabase SQL Editor now.
-- Supports "start a discussion" being open to everyone, with editors
-- able to take down anything offensive or off-topic after the fact.
-- ============================================================

create policy "editors delete discussions" on discussions for delete
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));

create policy "editors delete replies" on discussion_replies for delete
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));
