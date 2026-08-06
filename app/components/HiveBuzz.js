"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const FALLBACK = ["New commercial breakdowns published every week"];

export default function HiveBuzz() {
  const [messages, setMessages] = useState([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    async function loadActivity() {
      const items = [];
      try {
        const { data: articles } = await supabase
          .from("articles")
          .select("title, profiles(name)")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);
        articles?.forEach((a) => {
          if (a.profiles?.name) items.push(`${a.profiles.name} published "${a.title}"`);
        });

        const { data: newest } = await supabase
          .from("profiles")
          .select("name")
          .order("created_at", { ascending: false })
          .limit(1);
        if (newest?.[0]?.name) items.push(`${newest[0].name} just joined the Hive`);
      } catch {
        // Supabase unreachable or errored — fall through to the evergreen message below.
      }
      setMessages(items.length ? items : FALLBACK);
    }
    loadActivity();
  }, []);

  useEffect(() => {
    if (messages.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="bg-charcoal border-b border-white/10">
      <div className="max-w-[1120px] mx-auto flex items-center gap-3 px-6 py-3">
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-light animate-pulse" />
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-amber-light font-medium">
            The Hive is buzzing
          </span>
        </span>
        <span key={i} className="text-sm text-cream/85 animate-fade-in">
          {messages[i]}
        </span>
      </div>
    </div>
  );
}
