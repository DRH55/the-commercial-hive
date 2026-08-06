import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  // Not configured yet — no-op so likes still work fine without email notifications.
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, skipped: "email not configured" });
  }

  try {
    const { authorId, likerName, type, title } = await req.json();
    if (!authorId || !type) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const { data: author } = await supabase.from("profiles").select("name, email").eq("id", authorId).single();
    if (!author?.email) {
      return NextResponse.json({ ok: false, error: "author not found" }, { status: 404 });
    }

    const who = likerName || "Someone";
    const subject = type === "article"
      ? "Someone liked your article on The Commercial Hive"
      : "Someone liked your reply on The Commercial Hive";
    const text = type === "article"
      ? `${who} liked your article${title ? ` "${title}"` : ""} on The Commercial Hive.`
      : `${who} liked your reply on The Commercial Hive.`;

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "The Commercial Hive <notifications@thecommercialhive.com>",
      to: author.email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
