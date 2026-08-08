"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ShieldCheck, UserPlus, ListChecks, Pencil, Ban, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES, categoryLabel } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";
import Avatar from "../components/Avatar";

const EDIT_FIELDS = [
  { key: "title", label: "Title", type: "input" },
  { key: "category_id", label: "Category", type: "select" },
  { key: "excerpt", label: "The Hook", type: "textarea" },
  { key: "background", label: "What Happened", type: "textarea" },
  { key: "commercial", label: "Commercially", type: "textarea" },
  { key: "legal", label: "Legally", type: "textarea" },
  { key: "interview", label: "Interview Relevance", type: "textarea" },
];

export default function ReviewQueuePage() {
  const { profile, loading } = useAuth();
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data: pendingData } = await supabase.from("articles").select("*, profiles(name)").eq("status", "pending").order("created_at");
    const { data: publishedData } = await supabase.from("articles").select("*, profiles(name)").eq("status", "published").order("published_at", { ascending: false }).limit(20);
    const { data: rejectedData } = await supabase.from("articles").select("*, profiles(name)").eq("status", "rejected").order("created_at", { ascending: false }).limit(10);
    const { data: applicationData } = await supabase.from("applications").select("*, profiles(name, bio, university)").eq("status", "pending").order("created_at");
    setPending(pendingData || []);
    setPublished(publishedData || []);
    setRejected(rejectedData || []);
    setApplications(applicationData || []);
  }

  useEffect(() => { load(); }, []);

  async function decide(article, decision) {
    await supabase.from("articles").update({
      status: decision === "approve" ? "published" : "rejected",
      published_at: decision === "approve" ? new Date().toISOString() : null,
    }).eq("id", article.id);
    load();
  }

  async function unpublish(article) {
    if (!confirm(`Take "${article.title}" down from the live site? It'll move to Rejected and won't be reachable at its published link anymore.`)) return;
    await supabase.from("articles").update({ status: "rejected", published_at: null }).eq("id", article.id);
    load();
  }

  async function decideApplication(app, decision) {
    await supabase.from("applications").update({ status: decision }).eq("id", app.id);
    load();
  }

  function startEdit(article) {
    setEditingId(article.id);
    setEditForm({ ...article });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit() {
    setSaving(true);
    await supabase.from("articles").update({
      title: editForm.title,
      category_id: editForm.category_id,
      excerpt: editForm.excerpt,
      background: editForm.background,
      commercial: editForm.commercial,
      legal: editForm.legal,
      interview: editForm.interview,
    }).eq("id", editForm.id);
    setSaving(false);
    cancelEdit();
    load();
  }

  if (loading) return null;

  if (profile?.site_role !== "editor") {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <ShieldCheck size={22} className="mx-auto text-charcoal-soft" />
        <p className="text-charcoal-soft mt-3">You need Editor access to view the Review Queue. You can grant yourself demo access on your My Hive page.</p>
      </div>
    );
  }

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Editor Tools</div>
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-[30px]">Review Queue</h1>
          <p className="mt-2.5 text-charcoal-soft max-w-[560px]">Approving here publishes the piece to Commercial News immediately.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/review/members" className="btn-ghost inline-flex items-center gap-1.5">
            <Users size={14} /> Members
          </Link>
          <Link href="/review/challenges" className="btn-ghost inline-flex items-center gap-1.5">
            <ListChecks size={14} /> Manage Challenges
          </Link>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="mt-8 max-w-[700px]">
          <div className="flex items-center gap-1.5"><UserPlus size={14} className="text-amber" /><span className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Contributor Applications ({applications.length})</span></div>
          <div className="flex flex-col gap-3.5 mt-3">
            {applications.map((app) => (
              <div key={app.id} className="card">
                <div className="flex gap-3 items-start">
                  <Avatar photo={app.profiles?.photo_url} name={app.profiles?.name} size={36} />
                  <div className="flex-1">
                    <div className="font-semibold text-[15px]">{app.profiles?.name}</div>
                    {app.profiles?.university && <div className="text-xs text-charcoal-soft">{app.profiles.university}</div>}
                    {app.interest && <div className="text-xs text-amber font-semibold mt-1">Interested in: {app.interest}</div>}
                  </div>
                </div>
                <p className="text-sm text-charcoal-soft mt-3">{app.sample}</p>
                <p className="text-[11.5px] text-charcoal-soft mt-2">Contributor tiers are earned automatically from published articles, not assigned here.</p>
                <div className="flex gap-2 flex-wrap mt-3 items-center">
                  <button className="btn-primary text-xs" onClick={() => decideApplication(app, "accepted")}>Accept</button>
                  <button className="btn-ghost text-xs text-red-600 border-red-300" onClick={() => decideApplication(app, "declined")}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 max-w-[700px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Pending ({pending.length})</div>
        <div className="flex flex-col gap-3.5 mt-3">
          {pending.length === 0 && <div className="card text-center text-charcoal-soft py-8">Nothing waiting on review right now.</div>}
          {pending.map((a) => (
            <div key={a.id} className="card">
              {editingId === a.id ? (
                <ArticleEditForm form={editForm} setForm={setEditForm} onSave={saveEdit} onCancel={cancelEdit} saving={saving} />
              ) : (
                <>
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="text-[10.5px] font-mono uppercase tracking-wide bg-gold/15 text-gold px-2.5 py-1 rounded">Pending Review</span>
                        <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2.5 py-1 rounded">{categoryLabel(a.category_id)}</span>
                      </div>
                      <div className="font-semibold text-base mt-2">{a.title}</div>
                      <div className="text-[12.5px] text-charcoal-soft mt-1">By {a.profiles?.name}</div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => startEdit(a)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn-ghost inline-flex items-center gap-1.5 text-red-600 border-red-300" onClick={() => decide(a, "reject")}>
                        <XCircle size={14} /> Reject
                      </button>
                      <button className="btn-primary" onClick={() => decide(a, "approve")}>
                        <CheckCircle2 size={14} /> Approve &amp; Publish
                      </button>
                    </div>
                  </div>
                  <div className="card mt-3.5"><h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-1.5">The Hook</h4><p className="text-sm">{a.excerpt}</p></div>
                  <div className="card mt-2.5"><h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-1.5">Commercially</h4><p className="text-sm whitespace-pre-line">{a.commercial}</p></div>
                  <div className="card mt-2.5"><h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-1.5">Legally</h4><p className="text-sm whitespace-pre-line">{a.legal}</p></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-9 max-w-[700px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Published ({published.length})</div>
        <div className="flex flex-col gap-3.5 mt-3">
          {published.length === 0 && <div className="card text-center text-charcoal-soft py-8">Nothing published yet.</div>}
          {published.map((a) => (
            <div key={a.id} className="card">
              {editingId === a.id ? (
                <ArticleEditForm form={editForm} setForm={setEditForm} onSave={saveEdit} onCancel={cancelEdit} saving={saving} />
              ) : (
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <span className="text-[10.5px] font-mono uppercase tracking-wide bg-amber/10 text-amber px-2.5 py-1 rounded">published</span>
                    <div className="font-semibold text-base mt-2">{a.title}</div>
                    <div className="text-[12.5px] text-charcoal-soft mt-1">By {a.profiles?.name}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/news/${a.slug}`} className="btn-ghost">View live</Link>
                    <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => startEdit(a)}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button className="btn-ghost inline-flex items-center gap-1.5 text-red-600 border-red-300" onClick={() => unpublish(a)}>
                      <Ban size={13} /> Unpublish
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {rejected.length > 0 && (
        <div className="mt-9 max-w-[700px]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Recently Rejected</div>
          <div className="flex flex-col gap-2.5 mt-3">
            {rejected.map((a) => (
              <div key={a.id} className="card flex justify-between items-center">
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2.5 py-1 rounded">rejected</span>
                  <div className="font-semibold text-sm mt-1.5">{a.title}</div>
                </div>
                <span className="text-xs text-charcoal-soft">{a.profiles?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ArticleEditForm({ form, setForm, onSave, onCancel, saving }) {
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-3">
      {EDIT_FIELDS.map((f) => (
        <div key={f.key}>
          <label className="text-[11px] font-mono uppercase tracking-wide text-charcoal-soft">{f.label}</label>
          {f.type === "select" ? (
            <select className="field-input mt-1.5" value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          ) : f.type === "textarea" ? (
            <textarea className="field-input mt-1.5" rows={4} value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} />
          ) : (
            <input className="field-input mt-1.5" value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save changes"}</button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
