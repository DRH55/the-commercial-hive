"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categoryLabel } from "@/lib/data";
import Avatar from "./components/Avatar";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    supabase.from("articles").select("*, profiles(name)").eq("status", "published")
      .order("published_at", { ascending: false }).limit(3)
      .then(({ data }) => setArticles(data || []));

    supabase.from("challenges").select("*").order("created_at").limit(1)
      .then(({ data }) => setChallenge(data?.[0] || null));

    supabase.from("profiles").select("*").order("created_at").limit(3)
      .then(({ data }) => setContributors(data || []));
  }, []);

  return (
    <>
      <header className="border-b border-line relative overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6 pt-20 pb-16">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">The Commercial Hive</div>
          <h1 className="text-[clamp(34px,5.2vw,58px)] leading-[1.05] max-w-[780px] font-medium">
            Where future commercial lawyers <span className="text-amber">develop</span> commercial judgement.
          </h1>
          <p className="mt-5 text-[17px] text-charcoal-soft max-w-[560px] leading-relaxed">
            Not another publication. A platform where members contribute commercial analysis,
            take on real scenarios, and build a portfolio they can actually show employers.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link href="/challenges" className="btn-primary">Try a Commercial Challenge <ArrowRight size={14} /></Link>
            <Link href="/news" className="btn-ghost">Read the latest breakdowns</Link>
          </div>
        </div>
      </header>

      <section className="max-w-[1120px] mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Latest</div>
            <h2 className="text-[26px]">Commercial breakdowns</h2>
          </div>
          <Link href="/news" className="text-amber text-sm font-semibold flex items-center gap-1">View all <ChevronRight size={14} /></Link>
        </div>

        {articles.length === 0 ? (
          <div className="card empty-state text-center py-12 text-charcoal-soft">
            No published articles yet — once you approve one in the Review Queue, it'll show up here.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="card card-clickable block">
                <span className="text-[10.5px] font-mono uppercase tracking-wide bg-amber/10 text-amber px-2.5 py-1 rounded">{a.tag}</span>
                <h3 className="text-lg font-medium mt-3 leading-snug">{a.title}</h3>
                <p className="text-sm text-charcoal-soft mt-3">{a.excerpt}</p>
                <p className="text-[12.5px] text-charcoal-soft mt-2.5">{a.profiles?.name} · {new Date(a.published_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {(challenge || contributors.length > 0) && (
        <section className="max-w-[1120px] mx-auto px-6 pb-16">
          <div className="grid gap-5 sm:grid-cols-2">
            {challenge && (
              <div className="card border-l-[3px] border-l-amber">
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Weekly Challenge</div>
                <h3 className="text-[19px]">{challenge.title}</h3>
                <p className="text-[13.5px] text-charcoal-soft mt-2.5">{challenge.scenario}</p>
                <Link href={`/challenges/${challenge.id}`} className="btn-ghost mt-4 inline-block">Take the challenge</Link>
              </div>
            )}
            {contributors.length > 0 && (
              <div className="card">
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Featured Contributors</div>
                <div className="flex flex-col gap-3.5 mt-1">
                  {contributors.map((c) => (
                    <div key={c.id} className="flex gap-2.5 items-center">
                      <Avatar photo={c.photo_url} name={c.name} size={34} />
                      <div>
                        <div className="text-[13.5px] font-semibold">{c.name}</div>
                        <div className="text-xs text-amber">{c.contributor_tier || "Member"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/contributors" className="text-amber text-sm font-semibold flex items-center gap-1 mt-3">Meet everyone <ChevronRight size={14} /></Link>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="max-w-[1120px] mx-auto px-6 pb-20">
        <div className="card bg-charcoal text-cream text-center py-10 px-8">
          <Sparkles size={22} className="text-amber-light mx-auto" />
          <h3 className="text-2xl mt-3.5 text-cream">Ready to build your commercial portfolio?</h3>
          <p className="text-cream/70 mt-2.5 max-w-[480px] mx-auto">Applications are open to law, SQE, LPC and GDL students at any stage.</p>
          <Link href="/signup" className="btn-primary mt-5 bg-amber inline-flex">Apply to Contribute</Link>
        </div>
      </section>
    </>
  );
}
