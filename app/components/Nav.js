"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Avatar from "./Avatar";
import { supabase } from "@/lib/supabase/client";

const LINKS = [
  { href: "/news", label: "Commercial News" },
  { href: "/challenges", label: "Challenges" },
  { href: "/discussions", label: "Discussions" },
  { href: "/contributors", label: "Contributors" },
  { href: "/careers", label: "Careers" },
];

export default function Nav() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-line">
      <div className="max-w-[1120px] mx-auto flex items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="The Commercial Hive" width={32} height={32} />
          <span className="font-display font-semibold text-[17px]">The Commercial <span className="text-amber">Hive</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13.5px] font-medium text-charcoal-soft hover:text-charcoal">
              {l.label}
            </Link>
          ))}
          <Link href="/profile" className="text-[13.5px] font-medium text-charcoal-soft hover:text-charcoal">My Hive</Link>
          {profile?.site_role === "editor" && (
            <Link href="/review" className="text-[13.5px] font-medium text-amber">Review Queue</Link>
          )}
          {user && !profile?.contributor_tier && profile?.site_role !== "editor" && (
            <Link href="/apply" className="btn-ghost">Apply to Contribute</Link>
          )}
          {user ? (
            <Link href="/profile" className="flex items-center gap-2">
              <Avatar photo={profile?.photo_url} name={profile?.name} size={28} />
              <span className="text-[13.5px] font-medium">{profile?.name?.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link href="/login" className="btn-ghost inline-flex items-center gap-1.5"><LogIn size={14} /> Sign In</Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-4 border-t border-line">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="py-2.5 border-b border-line text-sm" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/profile" className="py-2.5 border-b border-line text-sm" onClick={() => setOpen(false)}>My Hive</Link>
          {profile?.site_role === "editor" && (
            <Link href="/review" className="py-2.5 border-b border-line text-sm text-amber" onClick={() => setOpen(false)}>Review Queue</Link>
          )}
          {!user && (
            <Link href="/login" className="btn-ghost mt-3 justify-center inline-flex items-center gap-1.5" onClick={() => setOpen(false)}>
              <LogIn size={14} /> Sign In
            </Link>
          )}
          {user && (
            <button className="btn-ghost mt-3" onClick={() => supabase.auth.signOut()}>Sign out</button>
          )}
        </div>
      )}
    </nav>
  );
}
