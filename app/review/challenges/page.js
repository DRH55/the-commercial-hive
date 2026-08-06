"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES, categoryLabel } from "@/lib/data";
import { useAuth } from "../../components/AuthProvider";

const DIFFICULTIES = ["Foundation", "Intermediate", "Advanced"];

const EMPTY_FORM = {
  title: "", category_id: CATEGORIES[0].id, difficulty: DIFFICULTIES[0], scenario: "", question: "",
};

export default function ManageChallengesPage() {
  const { profile, loading } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const { data } = await supabase.from("challenges").select("*").order("created_at", { ascending: false });
    setChallenges(data || []);
  }

  useEffect(() => { load(); }, []);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("challenges").insert({
      title: form.title,
      category_id: form.category_id,
      difficulty: form.difficulty,
      scenario: form.scenario,
      question: form.question,
    });
    setSaving(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Challenge added.");
      setForm(EMPTY_FORM);
      load();
    }
  }

  if (loading) return null;

  if (profile?.site_role !== "editor") {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <ShieldCheck size={22} className="mx-auto text-charcoal-soft" />
        <p className="text-charcoal-soft mt-3">You need Editor access to manage challenges.</p>
      </div>
    );
  }

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Editor Tools</div>
      <h1 className="text-[30px]">Manage Challenges</h1>
      <p className="mt-2.5 text-charcoal-soft max-w-[560px]">
        New challenges appear on the <Link href="/challenges" className="text-amber font-semibold">Challenges</Link> page immediately.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 max-w-[640px] flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide text-charcoal-soft">Title</label>
          <input required className="field-input mt-1.5" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <label className="text-[11px] font-mono uppercase tracking-wide text-charcoal-soft">Category</label>
            <select className="field-input mt-1.5" value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="text-[11px] font-mono uppercase tracking-wide text-charcoal-soft">Difficulty</label>
            <select className="field-input mt-1.5" value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide text-charcoal-soft">Scenario</label>
          <textarea required rows={4} className="field-input mt-1.5" value={form.scenario} onChange={(e) => set("scenario", e.target.value)} />
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide text-charcoal-soft">Question</label>
          <textarea required rows={2} className="field-input mt-1.5" value={form.question} onChange={(e) => set("question", e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-1.5">
            <PlusCircle size={14} /> {saving ? "Adding…" : "Add Challenge"}
          </button>
          {message && <span className="text-sm text-charcoal-soft">{message}</span>}
        </div>
      </form>

      <div className="mt-9 max-w-[640px]">
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium">Existing Challenges ({challenges.length})</div>
        <div className="flex flex-col gap-2.5 mt-3">
          {challenges.map((c) => (
            <div key={c.id} className="card flex justify-between items-center gap-3">
              <div>
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-xs text-charcoal-soft mt-1">{categoryLabel(c.category_id)} · {c.difficulty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
