"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/profile");
  }

  return (
    <div className="max-w-[420px] mx-auto px-6 py-20">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Email</label>
          <input className="field-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Password</label>
          <input className="field-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary justify-center" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="text-sm text-charcoal-soft mt-5">
        New here? <Link href="/signup" className="text-amber font-semibold">Create a profile</Link>
      </p>
    </div>
  );
}
