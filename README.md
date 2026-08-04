# The Commercial Hive — Deployment Guide

This is a real, working version of the prototype: real user accounts, a real database,
real persistence. Follow these steps in order — none of them require coding, just account
creation and copy-pasting a few values. Should take about 30–45 minutes the first time.

---

## Step 1 — Create your Supabase project (the database + accounts)

1. Go to **supabase.com** → sign up (free) → "New Project"
2. Give it a name (e.g. "commercial-hive"), set a database password (save it somewhere), pick a region close to your users (e.g. UK/EU)
3. Wait ~2 minutes for it to spin up
4. In the left sidebar, go to **SQL Editor** → "New Query"
5. Open `supabase/schema.sql` from this project, copy the **entire file**, paste it into the SQL editor, click **Run**
   - This creates every table, security rule, and seeds the categories and challenges
6. Go to **Storage** (left sidebar) → "New bucket" → name it exactly `avatars` → toggle **Public bucket** ON → Create
   - This is where profile photos get stored

7. Go to **Project Settings → API**. You'll need two values from here in Step 3:
   - **Project URL**
   - **anon public** key (NOT the `service_role` key — never share that one)

---

## Step 2 — Get the code running on your computer (to test before going live)

You'll need **Node.js** installed (nodejs.org — get the LTS version) if you don't have it already.

1. Unzip this project folder somewhere
2. Open a terminal in that folder
3. Run:
   ```
   npm install
   ```
4. Copy `.env.local.example` to a new file called `.env.local`, and paste in your Supabase URL and anon key from Step 1
5. Run:
   ```
   npm run dev
   ```
6. Open `http://localhost:3000` — the site should be running for real, backed by your actual database

Try signing up for an account, submitting an article, and approving it (see "Becoming an Editor" below) to confirm everything's wired up before you go live.

---

## Step 3 — Put the code on GitHub

Vercel (Step 4) deploys straight from GitHub.

1. Go to **github.com** → sign up if you don't have an account → "New repository" → name it `the-commercial-hive` → Create
2. Follow GitHub's instructions on that page under "…or push an existing repository from the command line" — it'll be three commands run from inside this project folder

---

## Step 4 — Deploy to Vercel (hosting)

1. Go to **vercel.com** → sign up with your GitHub account (free)
2. "Add New Project" → select the `the-commercial-hive` repo you just pushed
3. Before clicking Deploy, expand **Environment Variables** and add the same two values from Step 1:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. In about a minute you'll get a live URL like `the-commercial-hive.vercel.app`

---

## Step 5 — Connect thecommercialhive.com

1. In your Vercel project → **Settings → Domains** → type `thecommercialhive.com` → Add
2. Vercel will show you either an **A record** or a **CNAME** to add — it tells you exactly which
3. Log into wherever you bought the domain (registrar) → find **DNS settings** → add the record Vercel showed you
4. DNS changes can take anywhere from a few minutes to a few hours to take effect. Vercel will show a green checkmark once it's live.

---

## Becoming an Editor (to approve submissions)

Sign up for an account on the live site, then on your **My Hive** page, scroll down to
"Grant myself Editor access (demo)" and click it. This is a deliberate prototype-only shortcut —
in a real launch you'd remove that button and assign the `editor` role manually in the Supabase
Table Editor (`profiles` table → find your row → set `site_role` to `editor`) or build an admin
screen for it later.

---

## What's included vs. what's simplified from the earlier prototype

**Fully working and real:** accounts, login/signup, profiles with photo upload, article
submission → editor review → publish flow, challenges with real response storage, discussions
with real replies, contributor directory with a leaderboard, category filters, badges computed
from real activity, streak field, related reading, print/share on profiles.

**Simplified or not yet ported**, to keep this shippable in one pass — all straightforward to
add back in a follow-up:
- The global **search modal**
- The homepage **"This Week in the Hive"** digest card
- The live **"Hive is buzzing"** activity ticker
- Scroll-reveal animations and the hero honeycomb drift
- The leaderboard is a simple ranked row rather than the fully custom hex-podium graphic

None of these affect real functionality — they're the polish layer. Happy to add any of them
back in whenever you're ready; just ask.

---

## Costs

Supabase and Vercel are both free at this scale (a few hundred users, moderate traffic). You'll
only need to pay if the platform grows significantly — both will email you well before anything
would ever be charged.
