"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES, slugify } from "@/lib/data";
import { useAuth } from "../../components/AuthProvider";

export default function SubmitArticlePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category_id: "", excerpt: "", background: "", commercial: "", legal: "", interview: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (!loading && !user) {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <p className="text-charcoal-soft">You need to sign in to submit an article.</p>
        <a href="/login" className="btn-primary inline-flex mt-4">Sign in</a>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.category_id || !form.excerpt || !form.background || !form.commercial || !form.legal || !form.interview) {
      setError("Please fill in every section before submitting.");
      return;
    }
    if (form.commercial.length < 200 || form.legal.length < 200) {
      setError("Aim for genuine depth: a couple of paragraphs, not a one-liner, in the commercial and legal sections.");
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase.from("articles").insert({
      title: form.title,
      slug: `${slugify(form.title)}-${Date.now().toString(36)}`,
      category_id: form.category_id,
      author_id: user.id,
      excerpt: form.excerpt,
      background: form.background,
      commercial: form.commercial,
      legal: form.legal,
      interview: form.interview,
      status: "pending",
    });
    setSubmitting(false);
    if (insertError) { setError(insertError.message); return; }
    router.push("/profile");
  }

  return (
    <section className="max-w-[620px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Submit an Article</div>
      <h1 className="text-[28px]">Every submission follows the same structure.</h1>
      <div className="card bg-cream-deep border-none mt-6">
        <p className="text-[13px] text-charcoal-soft">
          Nothing publishes automatically. Every submission goes to an editor first. Its status changes
          from <strong className="text-charcoal">Pending Review</strong> to <strong className="text-charcoal">Published</strong> once it's checked.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <Field label="Title"><input className="field-input" value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Category</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button"
                className={`btn-ghost ${form.category_id === c.id ? "bg-amber text-cream border-amber" : ""}`}
                onClick={() => set("category_id", c.id)}>{c.label}</button>
            ))}
          </div>
        </div>
        <Field label="The Hook: one or two sentences on what happened and why it's worth reading">
          <textarea className="field-input" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </Field>
        <Field label="What happened: the factual background, in your own words">
          <textarea className="field-input" rows={3} value={form.background} onChange={(e) => set("background", e.target.value)} />
        </Field>
        <Field label="Why it matters commercially: aim for 2 short paragraphs, not one line">
          <textarea className="field-input" rows={7} value={form.commercial} onChange={(e) => set("commercial", e.target.value)} />
        </Field>
        <Field label="Why it matters legally: aim for 2 short paragraphs, not one line">
          <textarea className="field-input" rows={7} value={form.legal} onChange={(e) => set("legal", e.target.value)} />
        </Field>
        <Field label="Interview relevance">
          <textarea className="field-input" rows={3} value={form.interview} onChange={(e) => set("interview", e.target.value)} />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary justify-center" disabled={submitting}>
          <Send size={14} /> {submitting ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
