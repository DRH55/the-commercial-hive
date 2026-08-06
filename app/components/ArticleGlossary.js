"use client";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ArticleGlossary({ articleId, canEdit }) {
  const [terms, setTerms] = useState([]);
  const [adding, setAdding] = useState(false);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("article_glossary_terms").select("*").eq("article_id", articleId).order("created_at");
    setTerms(data || []);
  }

  useEffect(() => { load(); }, [articleId]);

  async function addTerm() {
    if (!term.trim() || !definition.trim()) return;
    setSaving(true);
    await supabase.from("article_glossary_terms").insert({ article_id: articleId, term, definition });
    setSaving(false);
    setTerm("");
    setDefinition("");
    setAdding(false);
    load();
  }

  async function removeTerm(id) {
    await supabase.from("article_glossary_terms").delete().eq("id", id);
    load();
  }

  if (terms.length === 0 && !canEdit) return null;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="card bg-cream-deep border-none">
        <div className="flex items-center gap-1.5">
          <BookOpen size={14} className="text-amber" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Key Terms</span>
        </div>
        <p className="text-[11.5px] text-charcoal-soft mt-1.5">Jargon explained here, no new tab needed.</p>

        <div className="flex flex-col gap-3 mt-4">
          {terms.map((t) => (
            <div key={t.id} className="border-t border-line/70 pt-3 first:border-t-0 first:pt-0">
              <div className="flex justify-between items-start gap-2">
                <div className="font-display font-semibold text-[14px]">{t.term}</div>
                {canEdit && (
                  <button onClick={() => removeTerm(t.id)} className="text-charcoal-soft hover:text-charcoal flex-shrink-0" aria-label="Remove term">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <p className="text-[12.5px] text-charcoal-soft mt-1 leading-relaxed">{t.definition}</p>
            </div>
          ))}
          {terms.length === 0 && canEdit && <p className="text-[12.5px] text-charcoal-soft">No terms added yet.</p>}
        </div>

        {canEdit && (
          adding ? (
            <div className="mt-4 flex flex-col gap-2">
              <input className="field-input text-sm" placeholder="Term" value={term} onChange={(e) => setTerm(e.target.value)} />
              <textarea className="field-input text-sm" rows={3} placeholder="Plain-English meaning" value={definition} onChange={(e) => setDefinition(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn-primary text-xs" disabled={saving} onClick={addTerm}>{saving ? "Adding…" : "Add"}</button>
                <button className="btn-ghost text-xs" onClick={() => { setAdding(false); setTerm(""); setDefinition(""); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn-ghost text-xs mt-4 inline-flex items-center gap-1.5" onClick={() => setAdding(true)}>
              <Plus size={12} /> Add a term
            </button>
          )
        )}
      </div>
    </div>
  );
}
