import { supabaseServer } from "@/lib/supabase/server";

export async function generateMetadata({ params }) {
  try {
    const { data } = await supabaseServer()
      .from("profiles")
      .select("name, site_role, contributor_tier, bio")
      .eq("id", params.id)
      .maybeSingle();

    // Member profiles are public to anyone with the link, but we ask search
    // engines not to list them. Link previews (LinkedIn etc.) still work.
    const robots = { index: false, follow: true };
    if (!data) return { title: { absolute: "Profile | The Commercial Hive" }, robots };

    const role = data.site_role === "editor" ? "Editor" : data.contributor_tier || "Member";
    const bio = (data.bio || "").replace(/\s+/g, " ").trim();
    const description = `${role} at The Commercial Hive.${bio ? ` ${bio}` : ""}`.slice(0, 200);
    return {
      title: { absolute: `${data.name} | The Commercial Hive` },
      description,
      robots,
      openGraph: {
        type: "profile",
        siteName: "The Commercial Hive",
        locale: "en_GB",
        title: `${data.name} | The Commercial Hive`,
        description,
      },
      twitter: { card: "summary_large_image", title: data.name, description },
    };
  } catch {
    return {};
  }
}

export default function ContributorLayout({ children }) {
  return children;
}
