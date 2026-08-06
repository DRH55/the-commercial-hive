"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, Printer, Share2, Award } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BADGES, computeEarnedBadges } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";
import Avatar from "../components/Avatar";

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [form, setForm] = useState(null);
  const [activity, setActivity] = useState({ articles: [], responses: [], replies: [], applications: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from("articles").select("*").eq("author_id", user.id).then(({ data }) => setActivity((a) => ({ ...a, articles: data || [] })));
    supabase.from("challenge_responses").select("*, challenges(category_id)").eq("user_id", user.id).then(({ data }) =>
      setActivity((a) => ({ ...a, responses: (data || []).map((r) => ({ ...r, category_id: r.challenges?.category_id })) })));
    supabase.from("discussion_replies").select("*").eq("author_id", user.id).then(({ data }) => setActivity((a) => ({ ...a, replies: data || [] })));
    supabase.from("applications").select("*").eq("user_id", user.id).then(({ data }) => setActivity((a) => ({ ...a, applications: data || [] })));
  }, [user]);

  async function saveField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await supabase.from("profiles").update({
      name: form.name, bio: form.bio, goals: form.goals, university: form.university, course: form.course,
    }).eq("id", user.id);
    setSaving(false);
    refreshProfile();
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ photo_url: data.publicUrl }).eq("id", user.id);
      refreshProfile();
    }
  }

  if (loading) return <div className="max-w-[700px] mx-auto px-6 py-16 text-charcoal-soft">Loading…</div>;

  if (!user) {
    return (
      <section className="max-w-[700px] mx-auto px-6 py-16">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">My Hive</div>
        <h1 className="text-[30px]">Your portfolio</h1>
        <p className="mt-2.5 text-charcoal-soft max-w-[560px]">Sign in or create a profile to start building a portfolio you can show employers.</p>
        <Link href="/signup" className="btn-primary mt-4 inline-flex"><LogIn size={14} /> Create your profile</Link>
      </section>
    );
  }

  if (!form) return null;
  const earned = computeEarnedBadges({ ...activity, contributorTier: profile.contributor_tier });

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16 print:py-4">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">My Hive</div>
        <div className="flex gap-2 print:hidden">
          <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => window.print()}><Printer size={13} /> Print / Save as PDF</button>
          <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/contributors/${user.id}`); alert("Link copied"); }}>
            <Share2 size={13} /> Copy Link
          </button>
        </div>
      </div>
      <h1 className="text-[30px]">Your profile</h1>
      <p className="mt-2.5 text-charcoal-soft max-w-[560px]">This is what a recruiter sees if they click through to you as a contributor — keep it current.</p>

      <div className="flex gap-4.5 items-center mt-7 print:hidden">
        <Avatar photo={form.photo_url} name={form.name} size={64} />
        <div className="flex-1 max-w-[360px]">
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">Name</label>
          <input className="field-input" value={form.name} onChange={(e) => saveField("name", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </div>
      </div>

      <div className="mt-6 max-w-[640px] flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">Who are you? (public bio)</label>
          <textarea className="field-input" rows={2} value={form.bio || ""} onChange={(e) => saveField("bio", e.target.value)} />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-semibold text-charcoal-soft block mb-1">University</label>
            <input className="field-input" value={form.university || ""} onChange={(e) => saveField("university", e.target.value)} />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-semibold text-charcoal-soft block mb-1">Studying</label>
            <input className="field-input" value={form.course || ""} onChange={(e) => saveField("course", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">What are you working toward?</label>
          <textarea className="field-input" rows={2} value={form.goals || ""} onChange={(e) => saveField("goals", e.target.value)} />
        </div>
        <button className="btn-primary self-start print:hidden" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </div>

      <div className="card bg-cream-deep border-none mt-6 max-w-[480px] print:hidden">
        <p className="text-xs text-charcoal-soft">
          {profile.site_role === "editor"
            ? <><strong className="text-charcoal">You're an Editor.</strong> You can review submissions in the Review Queue and accept contributor applications.</>
            : <>Want to become a contributor? <Link href="/apply" className="text-amber font-semibold">Apply here</Link>.</>}
        </p>
      </div>

      <div className="mt-9 max-w-[700px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Badges</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {BADGES.map((b) => {
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

      <div className="mt-9 max-w-[700px] print:hidden">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Activity</div>
        <div className="flex flex-col gap-2.5 mt-3">
          {[...activity.articles.map((a) => ({ label: a.status === "published" ? "Published Article" : a.status === "rejected" ? "Rejected" : "Pending Review", title: a.title })),
            ...activity.responses.map((r) => ({ label: "Challenge Response", title: "Submitted response" })),
            ...activity.replies.map((r) => ({ label: "Discussion Reply", title: r.body.slice(0, 60) })),
          ].map((item, i) => (
            <div key={i} className="card flex justify-between items-center">
              <span className="text-[10.5px] font-mono uppercase tracking-wide bg-amber/10 text-amber px-2.5 py-1 rounded">{item.label}</span>
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
          {activity.articles.length + activity.responses.length + activity.replies.length === 0 && (
            <p className="text-charcoal-soft text-sm">Nothing yet — try a challenge or submit an article.</p>
          )}
        </div>
      </div>

      <button className="btn-ghost mt-8 print:hidden" onClick={() => supabase.auth.signOut()}>Sign out</button>
    </section>
  );
}
