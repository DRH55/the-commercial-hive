"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES, categoryLabel } from "@/lib/data";

export default function GlossaryPage() {
  const [terms, setTerms] = useState([]);
  const [filter, setFilter] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase
      .from("article_glossary_terms")
      .select("id, term, definition, articles!inner(slug, title, category_id, status)")
      .eq("articles.status", "published")
      .order("term")
      .then(({ data }) => setTerms(data || []));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      const matchesCategory = !filter || t.articles?.category_id === filter;
      const matchesQuery = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [terms, filter, query]);

  const categoriesInUse = useMemo(
    () => CATEGORIES.filter((c) => terms.some((t) => t.articles?.category_id === c.id)),
    [terms]
  );

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Glossary</div>
      <h1 className="text-[30px] max-w-[640px]">Every key term, in one place.</h1>
      <p className="mt-2.5 text-charcoal-soft max-w-[600px]">
        Jargon explained across every published article, pulled together here so you don't have to hunt through
        individual pieces to find a definition.
      </p>

      <div className="relative mt-8 max-w-[360px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input
          className="field-input pl-9"
          placeholder="Search terms or definitions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-wrap mt-4">
        <button className={`btn-ghost ${!filter ? "bg-charcoal text-cream border-charcoal" : ""}`} onClick={() => setFilter(null)}>All</button>
        {categoriesInUse.map((c) => (
          <button key={c.id} className={`btn-ghost ${filter === c.id ? "bg-amber text-cream border-amber" : ""}`} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-8">
        {filtered.map((t) => (
          <div key={t.id} className="card">
            <div className="flex items-center justify-between gap-2">
              <div className="font-display font-semibold text-[16px]">{t.term}</div>
              <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2 py-0.5 rounded flex-shrink-0">
                {categoryLabel(t.articles?.category_id)}
              </span>
            </div>
            <p className="text-[13.5px] text-charcoal-soft mt-2 leading-relaxed">{t.definition}</p>
            {t.articles?.slug && (
              <Link href={`/news/${t.articles.slug}`} className="text-amber text-[12.5px] font-semibold mt-3 inline-flex items-center gap-1">
                <BookOpen size={12} /> From "{t.articles.title}"
              </Link>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center text-charcoal-soft py-10 sm:col-span-2">
            {terms.length === 0 ? "No terms have been added yet. They'll appear here as editors add them to articles." : "No terms match that search."}
          </div>
        )}
      </div>
    </section>
  );
}
