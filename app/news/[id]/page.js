"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { categoryLabel } from "@/lib/data";
import LikeButton from "../../components/LikeButton";
import ArticleGlossary from "../../components/ArticleGlossary";
import { useAuth } from "../../components/AuthProvider";

function MultiPara({ text }) {
  if (!text) return null;
  return text.split("\n\n").map((p, i) => <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>);
}

export default function ArticlePage() {
  const { id: slug } = useParams();
  const { user, profile } = useAuth();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    supabase.from("articles").select("*, profiles(name)").eq("slug", slug).single()
      .then(async ({ data }) => {
        setArticle(data);
        if (data) {
          const { data: relatedData } = await supabase.from("articles").select("*")
            .eq("category_id", data.category_id).eq("status", "published").neq("id", data.id).limit(3);
          setRelated(relatedData || []);
        }
      });
  }, [slug]);

  if (!article) return <div className="max-w-[700px] mx-auto px-6 py-16 text-charcoal-soft">Loading…</div>;

  const canEditGlossary = !!user && (user.id === article.author_id || profile?.site_role === "editor");

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <Link href="/news" className="text-sm font-semibold text-charcoal-soft">&larr; Back to Commercial News</Link>
      <div className="flex gap-1.5 mt-4">
        <span className="text-[10.5px] font-mono uppercase tracking-wide bg-amber/10 text-amber px-2.5 py-1 rounded">{article.tag}</span>
        <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2.5 py-1 rounded">{categoryLabel(article.category_id)}</span>
      </div>
      <h1 className="text-[clamp(26px,4vw,38px)] max-w-[760px] leading-tight mt-3.5">{article.title}</h1>
      <div className="flex items-center gap-4 mt-3">
        <p className="text-[12.5px] text-charcoal-soft">By {article.profiles?.name} · {new Date(article.published_at).toLocaleDateString()}</p>
        <LikeButton table="article_likes" column="article_id" targetId={article.id} authorId={article.author_id} notifyType="article" contentTitle={article.title} />
      </div>
      <p className="mt-5 text-[16.5px] text-charcoal-soft italic max-w-[640px] leading-relaxed">{article.excerpt}</p>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8 mt-2 items-start">
        <div className="min-w-0">
          <Block title="What happened" text={article.background} />
          <Block title="Why it matters commercially" text={article.commercial} />
          <Block title="Why it matters legally" text={article.legal} />
          <Block title="Interview relevance" text={article.interview} />
        </div>
        <ArticleGlossary articleId={article.id} canEdit={canEditGlossary} />
      </div>

      {related.length > 0 && (
        <div className="mt-10 max-w-[700px]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-3">Related Reading in {categoryLabel(article.category_id)}</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="card card-clickable block">
                <h4 className="text-[15px] font-medium">{a.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Block({ title, text }) {
  return (
    <div className="card mt-5 max-w-[680px]">
      <h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-2">{title}</h4>
      <div className="text-[14.5px] text-charcoal-soft leading-[1.75]"><MultiPara text={text} /></div>
    </div>
  );
}
