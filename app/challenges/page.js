"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categoryLabel } from "@/lib/data";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    supabase.from("challenges").select("*").order("created_at").then(({ data }) => setChallenges(data || []));
  }, []);

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Challenges</div>
      <h1 className="text-[30px] max-w-[640px]">Commercial scenarios. Business decisions. What would you advise?</h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-9">
        {challenges.map((c) => (
          <Link key={c.id} href={`/challenges/${c.id}`} className="card card-clickable block border-l-[3px] border-l-amber">
            <span className="text-[10.5px] font-mono uppercase tracking-wide bg-gold/15 text-gold px-2.5 py-1 rounded">{c.difficulty}</span>
            <h3 className="text-lg font-medium mt-3">{c.title}</h3>
            <p className="text-[13.5px] text-charcoal-soft mt-2.5">{c.scenario}</p>
            <div className="text-amber text-sm font-semibold flex items-center gap-1 mt-3.5">Take this challenge <ChevronRight size={14} /></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
