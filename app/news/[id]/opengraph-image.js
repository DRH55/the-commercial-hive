import { ImageResponse } from "next/og";
import { supabaseServer } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/data";
import { OgCard } from "@/lib/og";

export const alt = "Article on The Commercial Hive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  let article = null;
  try {
    const { data } = await supabaseServer()
      .from("articles")
      .select("title, category_id, profiles(name)")
      .eq("slug", params.id)
      .eq("status", "published")
      .maybeSingle();
    article = data;
  } catch {}

  return new ImageResponse(
    (
      <OgCard
        eyebrow={article ? categoryLabel(article.category_id) : "Commercial News"}
        title={article?.title || "Plain-English commercial analysis"}
        footer={article?.profiles?.name ? `By ${article.profiles.name}` : "Commercial News"}
      />
    ),
    size
  );
}
