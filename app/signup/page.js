"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", university: "", course: "", bio: "", goals: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) { setPhotoFile(null); return; }
    if (file.size > 5 * 1024 * 1024) {
      setError("That photo is over 5MB. Please choose a smaller file.");
      e.target.value = "";
      setPhotoFile(null);
      return;
    }
    setError("");
    setPhotoFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Create the auth user (this also triggers a `profiles` row via the DB trigger)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    const userId = data.user.id;

    // 2. Optionally upload their profile photo to Supabase Storage
    let photoUrl = null;
    if (photoFile) {
      const path = `${userId}/${Date.now()}-${photoFile.name}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, photoFile);
      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
        photoUrl = publicUrl.publicUrl;
      }
    }

    // 3. Fill in the rest of the profile (name/email were set by the trigger already)
    await supabase.from("profiles").update({
      university: form.university,
      course: form.course,
      bio: form.bio,
      goals: form.goals,
      ...(photoUrl ? { photo_url: photoUrl } : {}),
    }).eq("id", userId);

    setLoading(false);
    router.push("/profile");
  }

  return (
    <div className="max-w-[480px] mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold">Join the Hive</h1>
      <p className="text-[13.5px] text-charcoal-soft mt-2">This becomes your public contributor profile. You can edit anything later.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field label="Full name"><input className="field-input" required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Email"><input className="field-input" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Password"><input className="field-input" type="password" required minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)} /></Field>
        <Field label="Profile photo (optional)">
          <input type="file" accept="image/*" onChange={handlePhotoSelect} />
        </Field>
        <Field label="University"><input className="field-input" value={form.university} onChange={(e) => set("university", e.target.value)} placeholder="e.g. University of Bristol" /></Field>
        <Field label="What are you studying / did you study?"><input className="field-input" value={form.course} onChange={(e) => set("course", e.target.value)} placeholder="e.g. LLB Law, Final Year" /></Field>
        <Field label="Who are you? (public bio)"><textarea className="field-input" rows={2} value={form.bio} onChange={(e) => set("bio", e.target.value)} /></Field>
        <Field label="What are you working toward?"><textarea className="field-input" rows={2} value={form.goals} onChange={(e) => set("goals", e.target.value)} /></Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary justify-center" disabled={loading}>{loading ? "Creating…" : "Create profile"}</button>
      </form>

      <p className="text-sm text-charcoal-soft mt-5">
        Already have a profile? <Link href="/login" className="text-amber font-semibold">Sign in</Link>
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-charcoal-soft block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
