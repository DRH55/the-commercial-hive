-- ============================================================
-- The Commercial Hive — Database Schema
-- Run this entire file once in the Supabase SQL Editor
-- (Project → SQL Editor → New Query → paste this whole file → Run)
-- ============================================================

-- ---------- CATEGORIES ----------
create table categories (
  id text primary key,
  label text not null,
  sort_order int not null
);

insert into categories (id, label, sort_order) values
  ('corporate', 'Corporate', 1),
  ('banking', 'Banking & Finance', 2),
  ('pe', 'Private Equity', 3),
  ('capitalmarkets', 'Capital Markets', 4),
  ('realestate', 'Real Estate', 5),
  ('competition', 'Competition', 6),
  ('technology', 'Technology', 7),
  ('disputeresolution', 'Dispute Resolution', 8);

-- ---------- PROFILES ----------
-- One row per signed-up user. Created automatically when someone signs up (see trigger below).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  photo_url text,
  university text,
  course text,
  bio text,
  goals text,
  site_role text not null default 'member',        -- 'member' | 'editor'
  contributor_tier text,                             -- null | 'Guest Contributor' | 'Monthly Contributor' | 'Weekly Contributor'
  streak int not null default 0,
  created_at timestamptz not null default now()
);

-- Automatically create a profile row whenever someone signs up via Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'New Member'), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- ARTICLES ----------
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  tag text not null default 'Commercial Breakdown',
  category_id text not null references categories(id),
  author_id uuid not null references profiles(id),
  excerpt text not null,          -- "the hook"
  background text not null,       -- "what happened"
  commercial text not null,
  legal text not null,
  interview text not null,
  status text not null default 'pending',  -- 'pending' | 'published' | 'rejected'
  created_at timestamptz not null default now(),
  published_at timestamptz
);

-- ---------- CHALLENGES ----------
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id text not null references categories(id),
  difficulty text not null default 'Foundation', -- 'Foundation' | 'Intermediate' | 'Advanced'
  scenario text not null,
  question text not null,
  created_at timestamptz not null default now()
);

create table challenge_responses (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  response text not null,
  created_at timestamptz not null default now()
);

-- ---------- DISCUSSIONS ----------
create table discussions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id text references categories(id),
  author_id uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references discussions(id) on delete cascade,
  author_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------- CONTRIBUTOR APPLICATIONS ----------
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  interest text,
  sample text not null,
  status text not null default 'pending', -- 'pending' | 'accepted' | 'declined'
  created_at timestamptz not null default now()
);

-- ---------- BADGES (reference table; "earned" badges are computed, not stored) ----------
create table badges (
  id text primary key,
  name text not null,
  description text not null
);

insert into badges (id, name, description) values
  ('first-step', 'First Step', 'Made your first contribution'),
  ('applicant', 'Applicant', 'Applied to become a contributor'),
  ('guest-contributor', 'Guest Contributor', 'Invited to contribute a one-off piece'),
  ('monthly-contributor', 'Monthly Contributor', 'Publishes on a monthly cadence'),
  ('weekly-contributor', 'Weekly Contributor', 'Publishes on a weekly cadence'),
  ('sharp-thinker', 'Sharp Thinker', 'Submitted 3 challenge responses'),
  ('in-the-room', 'In The Room', 'Posted 3 discussion replies'),
  ('well-rounded', 'Well Rounded', 'Contributed across 2+ categories'),
  ('hive-regular', 'Hive Regular', 'Made 6+ contributions');

-- ============================================================
-- ROW LEVEL SECURITY
-- This is what makes the database safe to expose directly to the browser.
-- ============================================================

alter table profiles enable row level security;
alter table articles enable row level security;
alter table challenges enable row level security;
alter table challenge_responses enable row level security;
alter table discussions enable row level security;
alter table discussion_replies enable row level security;
alter table applications enable row level security;
alter table categories enable row level security;
alter table badges enable row level security;

-- Categories & badges: readable by everyone, editable by no one via the API
create policy "categories are public" on categories for select using (true);
create policy "badges are public" on badges for select using (true);

-- Profiles: everyone can read (it's a public directory); you can only edit your own
create policy "profiles are public" on profiles for select using (true);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

-- Articles: published articles are public. Authors can see their own pending/rejected ones too.
-- Editors can see and update everything.
create policy "published articles are public" on articles for select
  using (status = 'published' or author_id = auth.uid() or exists (
    select 1 from profiles where id = auth.uid() and site_role = 'editor'
  ));
create policy "signed in users submit articles" on articles for insert
  with check (auth.uid() = author_id);
create policy "editors update articles" on articles for update
  using (exists (select 1 from profiles where id = auth.uid() and site_role = 'editor'));

-- Challenges: public read
create policy "challenges are public" on challenges for select using (true);

-- Challenge responses: public read (they're portfolio pieces), owner-only insert
create policy "responses are public" on challenge_responses for select using (true);
create policy "users submit own responses" on challenge_responses for insert
  with check (auth.uid() = user_id);

-- Discussions & replies: public read, signed-in write
create policy "discussions are public" on discussions for select using (true);
create policy "signed in users start discussions" on discussions for insert
  with check (auth.uid() = author_id);
create policy "replies are public" on discussion_replies for select using (true);
create policy "signed in users reply" on discussion_replies for insert
  with check (auth.uid() = author_id);

-- Applications: owner + editors only
create policy "own applications visible" on applications for select
  using (auth.uid() = user_id or exists (
    select 1 from profiles where id = auth.uid() and site_role = 'editor'
  ));
create policy "users submit own applications" on applications for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- SEED CONTENT (the 9 articles + challenges from the prototype)
-- Note: these need a real author_id, so run this AFTER at least one profile exists,
-- or simply skip seeding and publish your first real articles through the site itself.
-- ============================================================
-- Seed challenges (no author needed, safe to run immediately):

insert into challenges (title, category_id, difficulty, scenario, question) values
('Your client''s biggest supplier just went into administration', 'banking', 'Foundation',
 'Your client, a mid-sized furniture retailer, relies on a single overseas supplier for 60% of its stock. That supplier has just entered administration with no warning.',
 'As the client''s advisor, what are your first three commercial priorities before you even think about the contract?'),
('A target company''s founder wants to stay on — but the board doesn''t', 'corporate', 'Intermediate',
 'You''re advising the buyer in an acquisition. The founder, who holds significant industry relationships, wants a long-term role post-completion. The acquiring board is skeptical of key-person risk cutting the other way.',
 'How would you structure a deal that manages this tension commercially, not just contractually?'),
('Your client wants to enter a market with unclear antitrust exposure', 'competition', 'Advanced',
 'A private equity client is considering a bolt-on acquisition that would give it a 35% share in a regional niche market — comfortably below headline thresholds, but the sector has recently drawn regulator attention.',
 'What commercial and legal red flags would you raise before recommending they proceed?'),
('A commercial landlord''s anchor tenant wants to break its lease early', 'realestate', 'Intermediate',
 'Your client owns a retail park where the anchor tenant, whose presence draws footfall for six smaller tenants, wants to exercise a break clause two years early.',
 'What commercial considerations sit alongside the strict legal right to break?'),
('A SaaS client''s biggest customer wants bespoke data terms', 'technology', 'Foundation',
 'Your client''s largest customer, worth 30% of ARR, is demanding non-standard data residency and audit rights that don''t fit the platform''s standard architecture.',
 'How do you balance commercial dependency on this customer against the precedent it sets for others?'),
('A founder wants to IPO earlier than the bankers recommend', 'capitalmarkets', 'Intermediate',
 'Your client''s founder is keen to list within six months, worried a competitor will beat them to market. The syndicate bankers think the business needs another year to show consistent margins.',
 'What commercial trade-offs would you want the founder to weigh before pushing the timetable?'),
('Your client has a strong legal case but a valuable ongoing relationship', 'disputeresolution', 'Foundation',
 'Your client believes a long-standing supplier has breached contract, and the legal merits are strong. But that supplier is also a key partner on future projects.',
 'How would you advise the client to weigh a strong legal claim against the value of the relationship?');

-- Articles are NOT seeded here because each needs a real author (a profile).
-- After you sign up as your first user, either publish articles through the
-- "Submit an Article" + Review Queue flow, or ask Claude to write a follow-up
-- SQL seed script using your real user id from the profiles table.
