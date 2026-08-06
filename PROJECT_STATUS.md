# Project Status — The Commercial Hive

Read this whole file first before doing anything. This is a handoff from a chat session
with Claude (claude.ai) where this Next.js + Supabase app was built and partially deployed.
The person you're helping has no coding experience — explain things simply, do the
Terminal/file work yourself rather than describing steps for them to type, and confirm
before anything destructive (deleting files, force-pushing, etc.).

## What this project is
A real, live web platform called "The Commercial Hive" — a community site for aspiring
commercial lawyers with accounts, article submissions + editor review, challenges,
discussions, contributor profiles, and badges. Next.js (App Router) + Supabase (database,
auth, storage) + Vercel (hosting).

## What's already done and working
- Supabase project created, full schema run (`supabase/schema.sql`) — all tables exist
- A security patch has ALREADY been run (`supabase/002_security_patch.sql`) — do not
  run either SQL file again, both are already applied to the live database
- Supabase Storage bucket `avatars` created and public
- GitHub repo exists: `the-commercial-hive` (uploaded via GitHub's web UI, not git CLI —
  so there is likely no local git history / this folder may not be a git repo yet locally)
- Vercel project is deployed and live, connected to that GitHub repo, with environment
  variables already set (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
- The person has signed up for an account and manually set their own `profiles.site_role`
  to `editor` directly in Supabase's Table Editor (so they should already be an Editor)

## What's NOT done yet — this is where you come in
1. **This local folder has a newer version of the code than what's on GitHub/Vercel.**
   Specifically these files are new or changed and were never successfully pushed:
   - `app/apply/page.js` (brand new — the Apply to Contribute page)
   - `app/profile/page.js` (removed an insecure self-service "become editor" button)
   - `app/review/page.js` (added an Applications section for editors to accept/decline)
   - `app/page.js` and `app/components/Nav.js` (small link updates for the Apply page)

   **Your first job:** get this local folder's code pushed to the GitHub repo `the-commercial-hive`
   so Vercel redeploys with these changes. Check whether this folder is already a git
   repository (`git status`) — if not, you'll likely need to connect it to the existing
   GitHub remote and push, or help them do it via GitHub Desktop if that's easier for them.
   Ask which GitHub account/repo URL if it's not obvious from context.

2. **Domain not connected yet.** They own `thecommercialhive.com` (registered at GoDaddy).
   It is NOT yet pointed at Vercel. Once the deploy above is confirmed working, the next
   step is: Vercel project → Settings → Domains → add `thecommercialhive.com` → Vercel
   shows a DNS record → add that record in GoDaddy's DNS settings for the domain.

3. **Full deployment instructions** are in `README.md` in this same folder if you need
   the original step-by-step reference.

## Known friction points from the chat session (so you can avoid repeating them)
- They got confused between Supabase's "Data API" tab (has the Project URL) and "API Keys"
  tab (has the anon/publishable key) — these are both already correctly set in Vercel, no
  action needed, just context.
- Vercel's GitHub App connection was flaky and needed a full sign-out/sign-in of Vercel to
  fix — if you hit "repo not showing in Vercel," that's a known issue, not new.
- They do not have Node.js confirmed working locally as of this handoff — check `node -v`
  early and install it if missing, since local testing is genuinely useful before pushing.

## Tone/approach requested
Be patient, avoid jargon where possible, and prefer doing the work directly (running
commands, editing files) over long written instructions — that's specifically why they
switched from chat-based guidance to Claude Code.
