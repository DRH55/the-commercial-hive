import { supabaseServer } from "@/lib/supabase/server";

const BASE = "https://www.thecommercialhive.com";

// Lists the public pages worth finding in search. Member profiles are left out on purpose.
export default async function sitemap() {
  const pages = ["", "/news", "/challenges", "/discussions", "/glossary", "/about", "/badges", "/privacy", "/terms"].map(
    (path) => ({ url: `${BASE}${path}`, changeFrequency: path === "" || path === "/news" ? "daily" : "monthly" })
  );

  let articles = [];
  let challenges = [];
  try {
    const db = supabaseServer();
    const [a, c] = await Promise.all([
      db.from("articles").select("slug, published_at").eq("status", "published"),
      db.from("challenges").select("id"),
    ]);
    articles = a.data || [];
    challenges = c.data || [];
  } catch {}

  return [
    ...pages,
    ...articles.map((a) => ({
      url: `${BASE}/news/${a.slug}`,
      lastModified: a.published_at || undefined,
      changeFrequency: "monthly",
    })),
    ...challenges.map((c) => ({ url: `${BASE}/challenges/${c.id}`, changeFrequency: "monthly" })),
  ];
}
