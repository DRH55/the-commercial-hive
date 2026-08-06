-- ============================================================
-- PATCH 5: Likes on articles and discussion replies
-- Run this in the Supabase SQL Editor now.
-- ============================================================

create table article_likes (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (article_id, user_id)
);

create table reply_likes (
  id uuid primary key default gen_random_uuid(),
  reply_id uuid not null references discussion_replies(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (reply_id, user_id)
);

alter table article_likes enable row level security;
alter table reply_likes enable row level security;

create policy "article likes are public" on article_likes for select using (true);
create policy "users like articles" on article_likes for insert with check (auth.uid() = user_id);
create policy "users unlike own article like" on article_likes for delete using (auth.uid() = user_id);

create policy "reply likes are public" on reply_likes for select using (true);
create policy "users like replies" on reply_likes for insert with check (auth.uid() = user_id);
create policy "users unlike own reply like" on reply_likes for delete using (auth.uid() = user_id);
