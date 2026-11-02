import { ImageResponse } from "next/og";
import { supabaseServer } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/data";
import { OgCard } from "@/lib/og";

export const alt = "Commercial challenge on The Commercial Hive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  let challenge = null;
  try {
    const { data } = await supabaseServer()
      .from("challenges")
      .select("title, category_id, difficulty")
      .eq("id", params.id)
      .maybeSingle();
    challenge = data;
  } catch {}

  return new ImageResponse(
    (
      <OgCard
        eyebrow={challenge ? `${categoryLabel(challenge.category_id)} · ${challenge.difficulty}` : "Commercial challenge"}
        title={challenge?.title || "A commercial challenge"}
        footer="Commercial challenge"
      />
    ),
    size
  );
}
