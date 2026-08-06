-- ============================================================
-- PATCH 6: Key-terms glossary on articles
-- Run this in the Supabase SQL Editor now.
-- Lets an article's author (or any editor) add short jargon
-- definitions shown alongside the piece.
-- ============================================================

create table article_glossary_terms (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  term text not null,
  definition text not null,
  created_at timestamptz not null default now()
);

alter table article_glossary_terms enable row level security;

create policy "glossary terms are public" on article_glossary_terms for select using (true);

create policy "authors and editors add glossary terms" on article_glossary_terms for insert
  with check (
    exists (select 1 from articles where id = article_id and author_id = auth.uid())
    or exists (select 1 from profiles where id = auth.uid() and site_role = 'editor')
  );

create policy "authors and editors delete glossary terms" on article_glossary_terms for delete
  using (
    exists (select 1 from articles where id = article_id and author_id = auth.uid())
    or exists (select 1 from profiles where id = auth.uid() and site_role = 'editor')
  );
