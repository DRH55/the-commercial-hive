import { createClient } from "@supabase/supabase-js";

// Read-only client for server code (metadata, sitemap, preview images).
// Uses the public anon key, so it only ever sees what a visitor could see.
// Caching is off so an edited title or a newly published article is picked up straight away.
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
    }
  );
}
