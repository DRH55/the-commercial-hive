"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, LogIn, Award } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { categoryLabel } from "@/lib/data";
import { useAuth } from "../components/AuthProvider";

const ELIGIBLE_TIERS = ["Monthly Contributor", "Weekly Contributor"];

export default function CertificatePage() {
  const { user, profile, loading } = useAuth();
  const [sectors, setSectors] = useState([]);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("articles").select("category_id").eq("author_id", user.id).eq("status", "published").then(({ data }) => {
      const unique = [...new Set((data || []).map((a) => a.category_id))];
      setSectors(unique.map(categoryLabel));
      setArticleCount(data?.length || 0);
    });
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <section className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <p className="text-charcoal-soft">Sign in to view your certificate.</p>
        <Link href="/login" className="btn-primary inline-flex mt-4"><LogIn size={14} /> Sign In</Link>
      </section>
    );
  }

  const isEligible = ELIGIBLE_TIERS.includes(profile?.contributor_tier);

  if (!isEligible) {
    return (
      <section className="max-w-[560px] mx-auto px-6 py-20 text-center">
        <Award size={22} className="mx-auto text-charcoal-soft" />
        <h1 className="text-2xl font-semibold mt-3">Certificates are for Monthly and Weekly Contributors</h1>
        <p className="text-charcoal-soft mt-3">
          Publish {profile?.contributor_tier === "Guest Contributor" ? "more articles" : "3 articles"} to
          automatically become a Monthly Contributor and unlock a personalised certificate. Your current status: {profile?.contributor_tier || "Member"}.
        </p>
        <Link href="/news/submit" className="btn-primary inline-flex mt-5">Submit an Article</Link>
      </section>
    );
  }

  const issuedOn = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="max-w-[900px] mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/profile" className="text-sm font-semibold text-charcoal-soft">&larr; Back to My Hive</Link>
        <button className="btn-primary inline-flex items-center gap-1.5" onClick={() => window.print()}>
          <Download size={14} /> Download as PDF
        </button>
      </div>

      <div
        className="relative bg-cream border-[3px] border-amber px-10 py-14 sm:px-16 sm:py-16 text-center print:border-2"
        style={{ boxShadow: "0 0 0 8px #fff, 0 0 0 9px rgba(198,117,43,0.25)" }}
      >
        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-amber opacity-60" />
        <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-amber opacity-60" />
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-amber opacity-60" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-amber opacity-60" />

        <div className="flex items-center justify-center gap-2.5">
          <Image src="/logo.png" alt="The Commercial Hive" width={36} height={36} />
          <span className="font-display font-semibold text-lg tracking-wide">THE COMMERCIAL <span className="text-amber">HIVE</span></span>
        </div>

        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber font-medium mt-8">Certificate of Contribution</div>
        <h1 className="text-[15px] text-charcoal-soft mt-4">This certifies that</h1>
        <h2 className="font-display text-[clamp(32px,5vw,52px)] font-semibold mt-2 leading-tight">{profile.name}</h2>
        <p className="text-[15.5px] text-charcoal-soft mt-4 max-w-[560px] mx-auto leading-relaxed">
          has served as a <strong className="text-charcoal">{profile.contributor_tier}</strong> at The Commercial Hive,
          contributing original commercial analysis{sectors.length > 0 && " in "}
          {sectors.length > 0 && <strong className="text-charcoal">{sectors.join(", ")}</strong>}.
          In recognition of {articleCount} published {articleCount === 1 ? "piece" : "pieces"} of commercial analysis
          and a demonstrated commitment to developing commercial awareness.
        </p>

        <div className="flex items-center justify-center gap-10 mt-10">
          <div className="text-center">
            <div className="font-display italic text-lg border-b border-charcoal-soft/40 pb-1.5 px-4">The Commercial Hive</div>
            <div className="text-[11px] text-charcoal-soft mt-1.5 uppercase tracking-wide">Editorial Team</div>
          </div>
          <div className="text-center">
            <div className="font-display text-lg border-b border-charcoal-soft/40 pb-1.5 px-4">{issuedOn}</div>
            <div className="text-[11px] text-charcoal-soft mt-1.5 uppercase tracking-wide">Date Issued</div>
          </div>
        </div>

        <div className="text-[11px] text-charcoal-soft mt-8">thecommercialhive.com</div>
      </div>
    </section>
  );
}
