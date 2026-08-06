"use client";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Users, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "../../components/AuthProvider";
import Avatar from "../../components/Avatar";

export default function MembersPage() {
  const { profile, loading } = useAuth();
  const [members, setMembers] = useState([]);
  const [articleCount, setArticleCount] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setMembers(data || []));
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published").then(({ count }) => setArticleCount(count || 0));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q));
  }, [members, query]);

  const editorCount = members.filter((m) => m.site_role === "editor").length;
  const contributorCount = members.filter((m) => m.contributor_tier).length;

  if (loading) return null;

  if (profile?.site_role !== "editor") {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <ShieldCheck size={22} className="mx-auto text-charcoal-soft" />
        <p className="text-charcoal-soft mt-3">You need Editor access to view Members.</p>
      </div>
    );
  }

  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-[11px] font-mono uppercase tracking-widest text-amber font-medium mb-2.5">Editor Tools</div>
      <h1 className="text-[30px]">Members</h1>
      <p className="mt-2.5 text-charcoal-soft max-w-[560px]">Everyone who's signed up, newest first.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7 max-w-[700px]">
        <div className="card text-center py-4">
          <div className="text-2xl font-display font-semibold">{members.length}</div>
          <div className="text-[11px] text-charcoal-soft mt-1">Total Members</div>
        </div>
        <div className="card text-center py-4">
          <div className="text-2xl font-display font-semibold">{editorCount}</div>
          <div className="text-[11px] text-charcoal-soft mt-1">Editors</div>
        </div>
        <div className="card text-center py-4">
          <div className="text-2xl font-display font-semibold">{contributorCount}</div>
          <div className="text-[11px] text-charcoal-soft mt-1">Tiered Contributors</div>
        </div>
        <div className="card text-center py-4">
          <div className="text-2xl font-display font-semibold">{articleCount}</div>
          <div className="text-[11px] text-charcoal-soft mt-1">Published Articles</div>
        </div>
      </div>

      <div className="relative mt-8 max-w-[360px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input
          className="field-input pl-9"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-charcoal-soft px-1">
          <Users size={13} /> {filtered.length} shown
        </div>
        {filtered.map((m) => (
          <div key={m.id} className="card flex items-center gap-3.5 flex-wrap">
            <Avatar photo={m.photo_url} name={m.name} size={36} />
            <div className="flex-1 min-w-[180px]">
              <div className="font-semibold text-[14.5px]">{m.name}</div>
              <div className="text-[12.5px] text-charcoal-soft">{m.email}</div>
            </div>
            {m.university && <div className="text-[12px] text-charcoal-soft min-w-[140px]">{m.university}</div>}
            <span className={`text-[10.5px] font-mono uppercase tracking-wide px-2.5 py-1 rounded ${m.site_role === "editor" ? "bg-amber/10 text-amber" : "bg-charcoal/[0.08] text-charcoal-soft"}`}>
              {m.site_role === "editor" ? "Editor" : m.contributor_tier || "Member"}
            </span>
            <span className="text-[12px] text-charcoal-soft min-w-[90px] text-right">
              {new Date(m.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <div className="card text-center text-charcoal-soft py-8">No members match that search.</div>}
      </div>
    </section>
  );
}
