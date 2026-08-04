"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES, categoryLabel } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";

export default function NewsPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    supabase.from("articles").select("*, profiles(name)").eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => setArticles(data || []));
  }, []);

  const filtered = filter ? articles.filter((a) => a.category_id === filter) : articles;

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Commercial News</div>
          <h1 className="text-[30px] max-w-[640px]">Commercial stories explained — not journalism, analysis.</h1>
        </div>
        <Link href={user ? "/news/submit" : "/login"} className="btn-primary"><Plus size={14} /> Submit an Article</Link>
      </div>

      <div className="flex gap-2 flex-wrap mt-5">
        <button className={`btn-ghost ${!filter ? "bg-charcoal text-cream border-charcoal" : ""}`} onClick={() => setFilter(null)}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`btn-ghost ${filter === c.id ? "bg-amber text-cream border-amber" : ""}`} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-charcoal-soft mt-7">No published articles in this category yet.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-7">
          {filtered.map((a) => (
            <Link key={a.id} href={`/news/${a.slug}`} className="card card-clickable block">
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10.5px] font-mono uppercase tracking-wide bg-amber/10 text-amber px-2.5 py-1 rounded">{a.tag}</span>
                <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2.5 py-1 rounded">{categoryLabel(a.category_id)}</span>
              </div>
              <h3 className="text-lg font-medium mt-3 leading-snug">{a.title}</h3>
              <p className="text-sm text-charcoal-soft mt-3">{a.excerpt}</p>
              <p className="text-[12.5px] text-charcoal-soft mt-2.5">{a.profiles?.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
