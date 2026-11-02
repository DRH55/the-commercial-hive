"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(
        /rate limit|seconds/i.test(error.message)
          ? "Too many requests. Please wait a minute and try again."
          : "We couldn't send that email. Check the address and try again."
      );
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-[420px] mx-auto px-6 py-20">
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="text-[14px] text-charcoal-soft mt-3 leading-relaxed">
          If there's a profile for <strong className="text-charcoal">{email.trim()}</strong>, we've sent a link to
          reset the password. It can take a few minutes to arrive, and it may land in your spam folder.
        </p>
        <Link href="/login" className="btn-ghost inline-flex mt-6">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[420px] mx-auto px-6 py-20">
      <h1 className="text-2xl font-semibold">Reset your password</h1>
      <p className="text-[13.5px] text-charcoal-soft mt-2">Enter the email you signed up with and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">Email</label>
          <input className="field-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary justify-center" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</button>
      </form>
      <p className="text-sm text-charcoal-soft mt-5">
        Remembered it? <Link href="/login" className="text-amber font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
