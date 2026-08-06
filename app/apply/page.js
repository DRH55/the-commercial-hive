"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "../components/AuthProvider";

export default function ApplyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [interest, setInterest] = useState("");
  const [sample, setSample] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!loading && !user) {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <p className="text-charcoal-soft">Create a profile first, then you can apply to contribute.</p>
        <a href="/signup" className="btn-primary inline-flex mt-4">Create your profile</a>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!sample.trim()) { setError("Please add a short writing sample or pitch."); return; }
    setSubmitting(true);
    const { error: insertError } = await supabase.from("applications").insert({
      user_id: user.id, interest, sample,
    });
    setSubmitting(false);
    if (insertError) { setError(insertError.message); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Application submitted</h1>
        <p className="text-charcoal-soft mt-3">An editor will review it and follow up. You can check its status any time on your My Hive page.</p>
        <a href="/profile" className="btn-primary inline-flex mt-5">Back to My Hive</a>
      </div>
    );
  }

  return (
    <section className="max-w-[500px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Apply to Contribute</div>
      <h1 className="text-2xl font-semibold">Join The Commercial Hive</h1>
      <p className="text-[13.5px] text-charcoal-soft mt-2">Anyone can apply. We look for clear thinking, not polish.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Interest area</label>
          <input className="field-input" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="e.g. M&A, fintech, competition law" />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Writing sample or short pitch</label>
          <textarea className="field-input" rows={5} value={sample} onChange={(e) => setSample(e.target.value)} placeholder="A paragraph on a commercial story that's caught your eye recently..." />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary justify-center" disabled={submitting}>{submitting ? "Submitting…" : "Submit application"}</button>
      </form>
    </section>
  );
}
