"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // The reset email's link signs the person in for this one purpose. If there's
  // no session, the link was missing, used already, or has expired.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setStatus(data.session ? "ready" : "invalid");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && active) setStatus("ready");
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Use at least 6 characters."); return; }
    if (password !== confirm) { setError("The two passwords don't match."); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setStatus("done");
  }

  if (status === "checking") {
    return <div className="max-w-[420px] mx-auto px-6 py-20 text-charcoal-soft">Checking your link…</div>;
  }

  if (status === "invalid") {
    return (
      <div className="max-w-[420px] mx-auto px-6 py-20">
        <h1 className="text-2xl font-semibold">This link has expired</h1>
        <p className="text-[14px] text-charcoal-soft mt-3 leading-relaxed">
          Reset links work once and only for a short time. Request a new one and use it straight away.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-flex mt-6">Send a new link</Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="max-w-[420px] mx-auto px-6 py-20">
        <h1 className="text-2xl font-semibold">Password updated</h1>
        <p className="text-[14px] text-charcoal-soft mt-3">You're signed in with your new password.</p>
        <Link href="/profile" className="btn-primary inline-flex mt-6">Go to My Hive</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[420px] mx-auto px-6 py-20">
      <h1 className="text-2xl font-semibold">Choose a new password</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">New password</label>
          <input className="field-input" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Confirm new password</label>
          <input className="field-input" type="password" required minLength={6} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary justify-center" disabled={saving}>{saving ? "Saving…" : "Update password"}</button>
      </form>
    </div>
  );
}
