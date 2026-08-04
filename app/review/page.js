"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categoryLabel } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";

export default function ReviewQueuePage() {
  const { profile, loading } = useAuth();
  const [pending, setPending] = useState([]);
  const [actioned, setActioned] = useState([]);

  async function load() {
    const { data: pendingData } = await supabase.from("articles").select("*, profiles(name)").eq("status", "pending").order("created_at");
    const { data: actionedData } = await supabase.from("articles").select("*, profiles(name)").in("status", ["published", "rejected"]).order("created_at", { ascending: false }).limit(10);
    setPending(pendingData || []);
    setActioned(actionedData || []);
  }

  useEffect(() => { load(); }, []);

  async function decide(article, decision) {
    await supabase.from("articles").update({
      status: decision === "approve" ? "published" : "rejected",
      published_at: decision === "approve" ? new Date().toISOString() : null,
    }).eq("id", article.id);
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
      <h1 className="text-[30px]">Review Queue</h1>
      <p className="mt-2.5 text-charcoal-soft max-w-[560px]">Approving here publishes the piece to Commercial News immediately.</p>

      <div className="mt-8 max-w-[700px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Pending ({pending.length})</div>
        <div className="flex flex-col gap-3.5 mt-3">
          {pending.length === 0 && <div className="card text-center text-charcoal-soft py-8">Nothing waiting on review right now.</div>}
          {pending.map((a) => (
            <div key={a.id} className="card">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10.5px] font-mono uppercase tracking-wide bg-gold/15 text-gold px-2.5 py-1 rounded">Pending Review</span>
                    <span className="text-[10.5px] font-mono uppercase tracking-wide bg-charcoal/[0.08] text-charcoal-soft px-2.5 py-1 rounded">{categoryLabel(a.category_id)}</span>
                  </div>
                  <div className="font-semibold text-base mt-2">{a.title}</div>
                  <div className="text-[12.5px] text-charcoal-soft mt-1">By {a.profiles?.name}</div>
                </div>
                <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      </div>

      {actioned.length > 0 && (
        <div className="mt-9 max-w-[700px]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Recently Actioned</div>
          <div className="flex flex-col gap-2.5 mt-3">
            {actioned.map((a) => (
              <div key={a.id} className="card flex justify-between items-center">
                <div>
                  <span className={`text-[10.5px] font-mono uppercase tracking-wide px-2.5 py-1 rounded ${a.status === "published" ? "bg-amber/10 text-amber" : "bg-charcoal/[0.08] text-charcoal-soft"}`}>{a.status}</span>
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
