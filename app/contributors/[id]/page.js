"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Printer, Share2, ChevronRight, Award, Flame, Linkedin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categoryLabel, BADGES, EDITOR_BADGE, computeEarnedBadges, externalUrl } from "@/lib/data";
import Avatar from "../../components/Avatar";

export default function ContributorProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [responses, setResponses] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    supabase.from("profiles")
      .select("id, name, photo_url, university, course, bio, goals, site_role, contributor_tier, streak, linkedin_url, created_at")
      .eq("id", id).single().then(({ data }) => setProfile(data));
    supabase.from("articles").select("*").eq("author_id", id).eq("status", "published").then(({ data }) => setArticles(data || []));
    supabase.from("challenge_responses").select("*, challenges(category_id)").eq("user_id", id).then(({ data }) =>
      setResponses((data || []).map((r) => ({ ...r, category_id: r.challenges?.category_id }))));
    supabase.from("discussion_replies").select("*").eq("author_id", id).then(({ data }) => setReplies(data || []));
  }, [id]);

  if (!profile) return <div className="max-w-[700px] mx-auto px-6 py-16 text-charcoal-soft">Loading…</div>;

  const isEditor = profile.site_role === "editor";
  const earned = computeEarnedBadges({ articles, responses, replies, contributorTier: profile.contributor_tier, siteRole: profile.site_role });
  const visibleBadges = isEditor ? [EDITOR_BADGE, ...BADGES] : BADGES;

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16 print:py-4">
      <Link href="/contributors" className="text-sm font-semibold text-charcoal-soft print:hidden">&larr; Back to Contributors</Link>

      <div className="flex justify-between items-start flex-wrap gap-3 mt-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Contributor Profile · Recruiter View</div>
        <div className="flex gap-2 print:hidden">
          <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => window.print()}><Printer size={13} /> Print / Save as PDF</button>
          <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Link copied"); }}>
            <Share2 size={13} /> Copy Link
          </button>
        </div>
      </div>

      <div className="flex gap-4.5 items-center mt-3">
        <Avatar photo={profile.photo_url} name={profile.name} size={64} />
        <div>
          <h1 className="text-[28px]">{profile.name}</h1>
          <div className="text-amber text-[13px] font-semibold mt-1">{profile.site_role === "editor" ? "Editor" : profile.contributor_tier || "Member"}</div>
          {profile.university && <div className="text-[12.5px] text-charcoal-soft mt-1">{profile.course ? `${profile.course} · ` : ""}{profile.university}</div>}
          {profile.streak > 0 && <div className="text-[11.5px] text-amber font-semibold mt-1 flex items-center gap-1"><Flame size={12} /> {profile.streak}-week contribution streak</div>}
        </div>
      </div>

      {profile.linkedin_url && (
        <a
          href={externalUrl(profile.linkedin_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="card card-clickable flex items-center gap-3 mt-5 max-w-[320px] print:hidden"
        >
          <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
            <Linkedin size={17} color="#fff" />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold">{profile.name} on LinkedIn</div>
            <div className="text-[12px] text-charcoal-soft">View profile</div>
          </div>
        </a>
      )}

      {profile.bio && <div className="card mt-6 max-w-[640px]"><h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-2">Who they are</h4><p className="text-[14.5px] text-charcoal-soft">{profile.bio}</p></div>}
      {profile.goals && <div className="card mt-4 max-w-[640px]"><h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-2">What they're working toward</h4><p className="text-[14.5px] text-charcoal-soft">{profile.goals}</p></div>}

      <div className="mt-9 max-w-[700px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Published Work ({articles.length})</div>
        {articles.length === 0 ? (
          <p className="text-[13.5px] text-charcoal-soft mt-2">No published pieces yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5 mt-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="card card-clickable flex justify-between items-center gap-3">
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2 py-0.5 rounded">{categoryLabel(a.category_id)}</span>
                  <div className="font-semibold text-[15px] mt-2">{a.title}</div>
                </div>
                <ChevronRight size={16} className="text-charcoal-soft flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-9 max-w-[700px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Badges</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {visibleBadges.map((b) => {
            const isEarned = earned.has(b.id);
            return (
              <div key={b.id} className={`card text-center py-4 ${isEarned ? "" : "opacity-40"}`}>
                <div className="hex w-10 h-10 mx-auto flex items-center justify-center" style={{ background: isEarned ? "#C6752B" : "rgba(33,29,26,0.11)" }}>
                  <Award size={18} color={isEarned ? "#FAF5EA" : "#4A423A"} />
                </div>
                <div className="text-[12.5px] font-semibold mt-2.5">{b.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
