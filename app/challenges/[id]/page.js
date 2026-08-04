"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "../../components/AuthProvider";

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.from("challenges").select("*").eq("id", id).single().then(({ data }) => setChallenge(data));
  }, [id]);

  async function submitResponse() {
    if (!answer.trim()) return;
    if (!user) { router.push("/login"); return; }
    await supabase.from("challenge_responses").insert({ challenge_id: id, user_id: user.id, response: answer });
    setSubmitted(true);
    setAnswer("");
  }

  if (!challenge) return <div className="max-w-[700px] mx-auto px-6 py-16 text-charcoal-soft">Loading…</div>;

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <Link href="/challenges" className="text-sm font-semibold text-charcoal-soft">&larr; Back to Challenges</Link>
      <span className="text-[10.5px] font-mono uppercase tracking-wide bg-gold/15 text-gold px-2.5 py-1 rounded inline-block mt-4">{challenge.difficulty}</span>
      <h1 className="text-[clamp(26px,4vw,38px)] max-w-[760px] leading-tight mt-3.5">{challenge.title}</h1>

      <div className="card mt-5 max-w-[680px]">
        <h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-2">Scenario</h4>
        <p className="text-[14.5px] text-charcoal-soft">{challenge.scenario}</p>
      </div>
      <div className="card mt-4 max-w-[680px]">
        <h4 className="text-[11px] font-mono uppercase tracking-wide text-amber font-medium mb-2">Question</h4>
        <p className="text-[14.5px] text-charcoal-soft">{challenge.question}</p>
      </div>

      <div className="mt-6 max-w-[640px]">
        {submitted ? (
          <div className="card bg-cream-deep border-none">Your response was added to your portfolio.</div>
        ) : (
          <>
            <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Your response</label>
            <textarea className="field-input" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)}
              placeholder="Set out your commercial reasoning, step by step..." />
            <button className="btn-primary mt-3.5" onClick={submitResponse}><Send size={14} /> Submit to my portfolio</button>
          </>
        )}
      </div>
    </section>
  );
}
