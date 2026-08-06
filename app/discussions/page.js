"use client";
import { useEffect, useState } from "react";
import { MessageSquare, Send, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";
import LikeButton from "../components/LikeButton";
import { useRouter } from "next/navigation";

export default function DiscussionsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [discussions, setDiscussions] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].id);
  const isEditor = profile?.site_role === "editor";

  async function load() {
    const { data } = await supabase.from("discussions").select("*, profiles(name), discussion_replies(*, profiles(name))").order("created_at", { ascending: false });
    setDiscussions(data || []);
  }

  useEffect(() => { load(); }, []);

  function startComposing() {
    if (!user) { router.push("/login"); return; }
    setComposing(true);
  }

  async function submitDiscussion() {
    if (!newTitle.trim()) return;
    await supabase.from("discussions").insert({ title: newTitle, category_id: newCategory, author_id: user.id });
    setNewTitle("");
    setComposing(false);
    load();
  }

  async function submitReply(discussionId) {
    if (!draft.trim()) return;
    if (!user) { router.push("/login"); return; }
    await supabase.from("discussion_replies").insert({ discussion_id: discussionId, author_id: user.id, body: draft });
    setDraft("");
    setOpenId(null);
    load();
  }

  async function deleteDiscussion(id) {
    if (!confirm("Remove this discussion and all its replies?")) return;
    await supabase.from("discussions").delete().eq("id", id);
    load();
  }

  async function deleteReply(id) {
    if (!confirm("Remove this reply?")) return;
    await supabase.from("discussion_replies").delete().eq("id", id);
    load();
  }

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Discussions · The Hive Mind</div>
          <h1 className="text-[30px] max-w-[640px]">Professional debate. Discuss, challenge, refine your thinking.</h1>
        </div>
        {!composing && (
          <button className="btn-primary inline-flex items-center gap-1.5" onClick={startComposing}>
            <Plus size={14} /> Start a Discussion
          </button>
        )}
      </div>

      {composing && (
        <div className="card mt-6 max-w-[600px]">
          <p className="text-[12.5px] text-charcoal-soft">Keep it constructive and on-topic: genuine commercial debate, not off-topic or offensive posts. Editors can remove anything that doesn't fit.</p>
          <input
            className="field-input mt-3"
            placeholder="What do you want to debate?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select className="field-input mt-3" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={submitDiscussion}>Post</button>
            <button className="btn-ghost" onClick={() => { setComposing(false); setNewTitle(""); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-9 max-w-[760px]">
        {discussions.length === 0 && <p className="text-charcoal-soft">No discussions yet. Be the first.</p>}
        {discussions.map((d) => (
          <div key={d.id} className="border-b border-line py-5">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-[17px] font-semibold">{d.title}</h3>
              {isEditor && (
                <button className="text-charcoal-soft hover:text-charcoal flex-shrink-0" onClick={() => deleteDiscussion(d.id)} aria-label="Remove discussion">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <p className="text-[12.5px] text-charcoal-soft mt-2">Started by {d.profiles?.name} · {d.discussion_replies.length} {d.discussion_replies.length === 1 ? "reply" : "replies"}</p>
            {d.discussion_replies.map((r) => (
              <div key={r.id} className="pl-4 border-l-2 border-line mt-3 flex justify-between items-start gap-3">
                <div>
                  <div className="text-[12.5px] font-semibold">{r.profiles?.name}</div>
                  <div className="text-[13.5px] text-charcoal-soft mt-1">{r.body}</div>
                  <div className="mt-1.5">
                    <LikeButton table="reply_likes" column="reply_id" targetId={r.id} authorId={r.author_id} notifyType="reply" />
                  </div>
                </div>
                {isEditor && (
                  <button className="text-charcoal-soft hover:text-charcoal flex-shrink-0" onClick={() => deleteReply(r.id)} aria-label="Remove reply">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            {openId === d.id ? (
              <div className="mt-3.5">
                <textarea className="field-input" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your perspective..." />
                <div className="flex gap-2 mt-2">
                  <button className="btn-primary" onClick={() => submitReply(d.id)}><Send size={13} /> Post reply</button>
                  <button className="btn-ghost" onClick={() => { setOpenId(null); setDraft(""); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="text-amber text-sm font-semibold flex items-center gap-1.5 mt-3.5" onClick={() => setOpenId(d.id)}>
                <MessageSquare size={14} /> Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
