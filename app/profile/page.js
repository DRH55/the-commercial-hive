"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, Printer, Share2, Award, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BADGES, EDITOR_BADGE, computeEarnedBadges, externalUrl } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";
import Avatar from "../components/Avatar";

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [form, setForm] = useState(null);
  const [activity, setActivity] = useState({ articles: [], responses: [], replies: [], applications: [] });
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
      name: form.name, bio: form.bio, goals: form.goals, university: form.university, course: form.course, linkedin_url: externalUrl(form.linkedin_url),
    }).eq("id", user.id);
    setSaving(false);
    refreshProfile();
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setPhotoError("");
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ photo_url: data.publicUrl }).eq("id", user.id);
      refreshProfile();
    } else {
      setPhotoError("Something went wrong uploading that photo. Please try again.");
    }
  }

  function cancelDelete() {
    setDeleteOpen(false);
    setDeleteConfirm("");
    setDeleteError("");
  }

  async function handleDeleteProfile() {
    setDeleting(true);
    setDeleteError("");

    // The database also refuses this, but check first so we don't remove their
    // photo and then fail.
    if (profile?.site_role === "editor") {
      const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("site_role", "editor");
      if ((count || 0) <= 1) {
        setDeleteError("You are the only editor. Make another member an editor before deleting your profile.");
        setDeleting(false);
        return;
      }
    }

    // Supabase doesn't clear storage when a user is deleted, so remove their photos first.
    const { data: files } = await supabase.storage.from("avatars").list(user.id);
    if (files?.length) {
      const paths = files.map((f) => `${user.id}/${f.name}`);
      const { data: removed, error: removeError } = await supabase.storage.from("avatars").remove(paths);
      if (removeError || (removed?.length || 0) < paths.length) {
        setDeleteError("We couldn't remove your profile photo, so nothing has been deleted. Please try again.");
        setDeleting(false);
        return;
      }
    }

    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      setDeleteError(error.message);
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/";
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
  const isEditor = profile.site_role === "editor";
  const earned = computeEarnedBadges({ ...activity, contributorTier: profile.contributor_tier, siteRole: profile.site_role });
  const visibleBadges = isEditor ? [EDITOR_BADGE, ...BADGES] : BADGES;

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
      <p className="mt-2.5 text-charcoal-soft max-w-[560px]">This is what a recruiter sees if they click through to you as a contributor. Keep it current.</p>

      <div className="flex gap-4.5 items-center mt-7 print:hidden">
        <Avatar photo={form.photo_url} name={form.name} size={64} />
        <div className="flex-1 max-w-[360px]">
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">Name</label>
          <input className="field-input" value={form.name} onChange={(e) => saveField("name", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {photoError && <p className="text-xs text-red-600 mt-1 max-w-[220px]">{photoError}</p>}
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
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1">LinkedIn profile URL</label>
          <input className="field-input" placeholder="https://www.linkedin.com/in/yourname" value={form.linkedin_url || ""} onChange={(e) => saveField("linkedin_url", e.target.value)} />
        </div>
        <button className="btn-primary self-start print:hidden" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </div>

      <div className="card bg-cream-deep border-none mt-6 max-w-[480px] print:hidden">
        <p className="text-xs text-charcoal-soft">
          {profile.site_role === "editor"
            ? <><strong className="text-charcoal">You're an Editor.</strong> You can review submissions in the Review Queue.</>
            : <>Publish articles to automatically become a Guest, Monthly, or Weekly Contributor. <Link href="/badges" className="text-amber font-semibold">See how it works</Link>.</>}
        </p>
      </div>

      {(profile.contributor_tier === "Monthly Contributor" || profile.contributor_tier === "Weekly Contributor") && (
        <Link href="/certificate" className="card card-clickable flex items-center gap-3 mt-4 max-w-[480px] print:hidden border-amber/40">
          <Award size={20} className="text-amber flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">Your certificate is ready</div>
            <div className="text-xs text-charcoal-soft">Download your personalised {profile.contributor_tier} certificate</div>
          </div>
        </Link>
      )}

      <div className="mt-9 max-w-[700px]">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Badges</div>
          <Link href="/badges" className="text-amber text-[12.5px] font-semibold">How badges work</Link>
        </div>
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

      <div className="mt-9 max-w-[700px] print:hidden">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Activity</div>
        <div className="flex flex-col gap-2.5 mt-3">
          {[...activity.articles.map((a) => ({ label: a.status === "published" ? "Published Article" : a.status === "rejected" ? "Rejected" : "Pending Review", title: a.title, href: `/news/${a.slug}` })),
            ...activity.responses.map((r) => ({ label: "Challenge Response", title: "Submitted response" })),
            ...activity.replies.map((r) => ({ label: "Discussion Reply", title: r.body.slice(0, 60) })),
          ].map((item, i) => {
            const content = (
              <>
                <span className="text-[10.5px] font-mono uppercase tracking-wide bg-amber/10 text-amber px-2.5 py-1 rounded">{item.label}</span>
                <span className="text-sm">{item.title}</span>
              </>
            );
            return item.href ? (
              <Link key={i} href={item.href} className="card card-clickable flex justify-between items-center">{content}</Link>
            ) : (
              <div key={i} className="card flex justify-between items-center">{content}</div>
            );
          })}
          {activity.articles.length + activity.responses.length + activity.replies.length === 0 && (
            <p className="text-charcoal-soft text-sm">Nothing yet. Try a challenge or submit an article.</p>
          )}
        </div>
      </div>

      <button className="btn-ghost mt-8 print:hidden" onClick={() => supabase.auth.signOut()}>Sign out</button>

      <div className="mt-14 pt-8 border-t border-line max-w-[700px] print:hidden">
        <div className="text-[11px] font-mono uppercase tracking-widest text-red-600 font-medium">Delete profile</div>
        {!deleteOpen ? (
          <>
            <p className="text-[13.5px] text-charcoal-soft mt-2 max-w-[560px]">
              Permanently remove your profile and everything you've added to The Commercial Hive.
            </p>
            <button className="btn-ghost mt-3 inline-flex items-center gap-1.5 text-red-600 border-red-300" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={13} /> Delete my profile
            </button>
          </>
        ) : (
          <div className="card mt-3 max-w-[560px] border-red-300">
            <h3 className="text-[17px] font-semibold">Delete your profile permanently?</h3>
            <p className="text-[13.5px] text-charcoal-soft mt-2">This will remove:</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1 text-[13.5px] text-charcoal-soft">
              <li>Your profile, photo and login</li>
              <li>Every article you've published or submitted, which will disappear from the site</li>
              <li>Discussions you started, including other people's replies in them, and your own replies</li>
              <li>Your challenge responses, likes and badges, plus any contributor tier or certificate</li>
            </ul>
            <p className="text-[13.5px] font-semibold mt-3">This can't be undone.</p>

            <label className="text-xs font-semibold text-charcoal-soft block mt-4 mb-1.5">Type DELETE to confirm</label>
            <input className="field-input" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} autoComplete="off" />

            {deleteError && <p className="text-sm text-red-600 mt-3">{deleteError}</p>}

            <div className="flex gap-2 mt-4">
              <button
                className="inline-flex items-center gap-1.5 rounded-[3px] bg-red-600 px-[18px] py-[9px] text-[13px] font-semibold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={deleteConfirm !== "DELETE" || deleting}
                onClick={handleDeleteProfile}
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
              <button className="btn-ghost" onClick={cancelDelete} disabled={deleting}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
