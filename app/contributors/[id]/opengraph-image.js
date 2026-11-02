import { ImageResponse } from "next/og";
import { supabaseServer } from "@/lib/supabase/server";
import { OgCard } from "@/lib/og";

export const alt = "Contributor profile on The Commercial Hive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  let member = null;
  try {
    const { data } = await supabaseServer()
      .from("profiles")
      .select("name, site_role, contributor_tier, course, university")
      .eq("id", params.id)
      .maybeSingle();
    member = data;
  } catch {}

  const role = member ? (member.site_role === "editor" ? "Editor" : member.contributor_tier || "Member") : "Contributor";
  const detail = member ? [member.course, member.university].filter(Boolean).join(" · ") : "";

  return new ImageResponse(
    (
      <OgCard
        eyebrow={role}
        title={member?.name || "Contributor profile"}
        footer={detail || "Contributor profile"}
      />
    ),
    size
  );
}
