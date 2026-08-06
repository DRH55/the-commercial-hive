-- ============================================================
-- PATCH 4: Add LinkedIn URL to profiles
-- Run this in the Supabase SQL Editor now.
-- ============================================================

alter table profiles add column linkedin_url text;
