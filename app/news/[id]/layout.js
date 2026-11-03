import { supabaseServer } from "@/lib/supabase/server";

export async function generateMetadata({ params }) {
  try {
    const { data } = await supabaseServer()
      .from("articles")
      .select("title, excerpt, published_at, profiles(name)")
      .eq("slug", params.id)
      .eq("status", "published")
      .maybeSingle();

    // Unpublished or unknown: the page itself still handles who may see it.
    if (!data) return { title: { absolute: "Article | The Commercial Hive" }, robots: { index: false, follow: false } };

    const description = (data.excerpt || "").replace(/\s+/g, " ").trim().slice(0, 200);
    const author = data.profiles?.name;
    return {
      title: { absolute: `${data.title} | The Commercial Hive` },
      description,
      alternates: { canonical: `/news/${params.id}` },
      openGraph: {
        type: "article",
        siteName: "The Commercial Hive",
        locale: "en_GB",
        url: `/news/${params.id}`,
        title: data.title,
        description,
        publishedTime: data.published_at || undefined,
        authors: author ? [author] : undefined,
      },
      twitter: { card: "summary_large_image", title: data.title, description },
    };
  } catch {
    return {};
  }
}

export default function ArticleLayout({ children }) {
  return children;
}
