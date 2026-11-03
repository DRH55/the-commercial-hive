import { supabaseServer } from "@/lib/supabase/server";

export async function generateMetadata({ params }) {
  try {
    const { data } = await supabaseServer()
      .from("challenges")
      .select("title, scenario")
      .eq("id", params.id)
      .maybeSingle();
    if (!data) return { title: { absolute: "Challenge | The Commercial Hive" } };

    const description = (data.scenario || "").replace(/\s+/g, " ").trim().slice(0, 200);
    return {
      title: { absolute: `${data.title} | The Commercial Hive` },
      description,
      alternates: { canonical: `/challenges/${params.id}` },
      openGraph: {
        type: "website",
        siteName: "The Commercial Hive",
        locale: "en_GB",
        url: `/challenges/${params.id}`,
        title: data.title,
        description,
      },
      twitter: { card: "summary_large_image", title: data.title, description },
    };
  } catch {
    return {};
  }
}

export default function ChallengeLayout({ children }) {
  return children;
}
