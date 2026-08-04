"use client";
import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";

export default function DiscussionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [discussions, setDiscussions] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState("");

  async function load() {
    const { data } = await supabase.from("discussions").select("*, profiles(name), discussion_replies(*, profiles(name))").order("created_at", { ascending: false });
    setDiscussions(data || []);
  }

  useEffect(() => { load(); }, []);

  async function submitReply(discussionId) {
    if (!draft.trim()) return;
    if (!user) { router.push("/login"); return; }
    await supabase.from("discussion_replies").insert({ discussion_id: discussionId, author_id: user.id, body: draft });
    setDraft("");
    setOpenId(null);
    load();
  }

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Discussions · The Hive Mind</div>
      <h1 className="text-[30px] max-w-[640px]">Professional debate. Discuss, challenge, refine your thinking.</h1>

      <div className="mt-9 max-w-[760px]">
        {discussions.length === 0 && <p className="text-charcoal-soft">No discussions yet — be the first.</p>}
        {discussions.map((d) => (
          <div key={d.id} className="border-b border-line py-5">
            <h3 className="text-[17px] font-semibold">{d.title}</h3>
            <p className="text-[12.5px] text-charcoal-soft mt-2">Started by {d.profiles?.name} · {d.discussion_replies.length} {d.discussion_replies.length === 1 ? "reply" : "replies"}</p>
            {d.discussion_replies.map((r) => (
              <div key={r.id} className="pl-4 border-l-2 border-line mt-3">
                <div className="text-[12.5px] font-semibold">{r.profiles?.name}</div>
                <div className="text-[13.5px] text-charcoal-soft mt-1">{r.body}</div>
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
