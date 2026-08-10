"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/data";
import Avatar from "../components/Avatar";

export default function ContributorsPage() {
  const [contributors, setContributors] = useState([]);
  const [articleCounts, setArticleCounts] = useState({});
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    supabase.from("profiles")
      .select("id, name, photo_url, university, course, bio, goals, site_role, contributor_tier, streak, linkedin_url, created_at")
      .order("created_at").then(({ data }) => setContributors(data || []));
    supabase.from("articles").select("author_id, category_id").eq("status", "published").then(({ data }) => {
      const counts = {};
      (data || []).forEach((a) => { counts[a.author_id] = counts[a.author_id] || []; counts[a.author_id].push(a.category_id); });
      setArticleCounts(counts);
    });
  }, []);

  const ranked = [...contributors]
    .map((c) => ({ ...c, score: (articleCounts[c.id]?.length || 0) * 5 + (c.streak || 0) * 2 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const filtered = filter ? contributors.filter((c) => (articleCounts[c.id] || []).includes(filter)) : contributors;

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Contributors</div>
      <h1 className="text-[30px] max-w-[640px]">Public profiles. Published work. Real portfolios.</h1>

      {ranked.length > 0 && (
        <div className="mt-7">
          <div className="flex items-center gap-1.5"><Trophy size={14} className="text-amber" /><span className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Top Contributors</span></div>
          <div className="flex gap-6 mt-4 flex-wrap">
            {ranked.map((c, i) => (
              <Link key={c.id} href={`/contributors/${c.id}`} className="flex flex-col items-center w-24 text-center">
                <div className="relative">
                  <Avatar photo={c.photo_url} name={c.name} size={64} />
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-charcoal text-amber-light flex items-center justify-center text-[11px] font-display font-bold border-2 border-white">{i + 1}</div>
                </div>
                <div className="text-[12.5px] font-semibold mt-2.5">{c.name}</div>
                {c.streak > 0 && <div className="text-[10.5px] text-amber font-semibold mt-1 flex items-center gap-1"><Flame size={10} /> {c.streak}w</div>}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mt-8">
        <button className={`btn-ghost ${!filter ? "bg-charcoal text-cream border-charcoal" : ""}`} onClick={() => setFilter(null)}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`btn-ghost ${filter === c.id ? "bg-amber text-cream border-amber" : ""}`} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-7">
        {filtered.map((c) => (
          <Link key={c.id} href={`/contributors/${c.id}`} className="card card-clickable flex gap-3.5 items-start">
            <Avatar photo={c.photo_url} name={c.name} size={40} />
            <div>
              <div className="font-display font-semibold text-[15.5px]">{c.name}</div>
              <div className="text-xs text-amber mt-0.5">{c.site_role === "editor" ? "Editor" : c.contributor_tier || "Member"}</div>
              {c.university && <div className="text-[11.5px] text-charcoal-soft mt-0.5">{c.university}</div>}
              <p className="text-[13px] text-charcoal-soft mt-2 leading-relaxed">{c.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
