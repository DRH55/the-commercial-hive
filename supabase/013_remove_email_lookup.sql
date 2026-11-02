-- ============================================================
-- PATCH 11: Close an email lookup that undid the email privacy fix
-- Run this in the Supabase SQL Editor now.
--
-- get_notify_email() (added in 011) returned a member's email for any member
-- id and could be called by anyone, which made emails readable again. It only
-- existed for like-notification emails, which were dropped, so it is removed.
-- ============================================================

drop function if exists public.get_notify_email(uuid);
