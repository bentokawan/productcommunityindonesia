import { unstable_cache } from "next/cache";
import { FALLBACK_LINKS, type SiteLinks } from "@/content/fallback-links";
import { createPublicServerClient } from "@/lib/supabase/server";
import { mapSiteSettings } from "@/lib/queries/mappers";

const fetchSiteLinks = unstable_cache(
  async (): Promise<SiteLinks> => {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error || !data) {
        console.error("Failed to fetch site_settings:", error?.message);
        return FALLBACK_LINKS;
      }
      return mapSiteSettings(data);
    } catch (err) {
      console.error("Unexpected error fetching site_settings:", err);
      return FALLBACK_LINKS;
    }
  },
  ["site_settings"],
  { tags: ["site_settings"], revalidate: 3600 },
);

export async function getSiteLinks(): Promise<SiteLinks> {
  return fetchSiteLinks();
}
