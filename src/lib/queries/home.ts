import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/server";
import {
  mapActivityRow,
  mapCommunityGroupRow,
  mapFaqRow,
  mapPartnerRow,
  mapSlideRow,
  mapStatRow,
  mapTeamMemberRow,
  type ActivityViewModel,
  type CommunityGroupViewModel,
  type FaqViewModel,
  type PartnerViewModel,
  type SlideViewModel,
  type StatViewModel,
  type TeamMemberViewModel,
} from "@/lib/queries/mappers";

export const getHeroData = unstable_cache(
  async (): Promise<{ stats: StatViewModel[]; slides: SlideViewModel[] }> => {
    try {
      const supabase = createPublicServerClient();
      const [statsRes, slidesRes] = await Promise.all([
        supabase
          .from("site_stats")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("hero_slides")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      if (statsRes.error) {
        console.error("Failed to fetch site_stats:", statsRes.error.message);
      }
      if (slidesRes.error) {
        console.error("Failed to fetch hero_slides:", slidesRes.error.message);
      }

      return {
        stats: (statsRes.data ?? []).map(mapStatRow),
        slides: (slidesRes.data ?? []).map(mapSlideRow),
      };
    } catch (err) {
      console.error("Unexpected error fetching hero data:", err);
      return { stats: [], slides: [] };
    }
  },
  ["hero_data"],
  { tags: ["site_stats", "hero_slides"], revalidate: 3600 },
);

export const getPartners = unstable_cache(
  async (): Promise<PartnerViewModel[]> => {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data) {
        console.error("Failed to fetch partners:", error?.message);
        return [];
      }
      return data.map(mapPartnerRow);
    } catch (err) {
      console.error("Unexpected error fetching partners:", err);
      return [];
    }
  },
  ["partners"],
  { tags: ["partners"], revalidate: 3600 },
);

export const getActivities = unstable_cache(
  async (): Promise<ActivityViewModel[]> => {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data) {
        console.error("Failed to fetch activities:", error?.message);
        return [];
      }
      return data.map(mapActivityRow);
    } catch (err) {
      console.error("Unexpected error fetching activities:", err);
      return [];
    }
  },
  ["activities"],
  { tags: ["activities"], revalidate: 3600 },
);

export const getCommunityGroups = unstable_cache(
  async (): Promise<CommunityGroupViewModel[]> => {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await supabase
        .from("community_groups")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data) {
        console.error("Failed to fetch community_groups:", error?.message);
        return [];
      }
      return data.map(mapCommunityGroupRow);
    } catch (err) {
      console.error("Unexpected error fetching community_groups:", err);
      return [];
    }
  },
  ["community_groups"],
  { tags: ["community_groups"], revalidate: 3600 },
);

export const getTeamMembers = unstable_cache(
  async (): Promise<TeamMemberViewModel[]> => {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data) {
        console.error("Failed to fetch team_members:", error?.message);
        return [];
      }
      return data.map(mapTeamMemberRow);
    } catch (err) {
      console.error("Unexpected error fetching team_members:", err);
      return [];
    }
  },
  ["team_members"],
  { tags: ["team_members"], revalidate: 3600 },
);

export const getFaqs = unstable_cache(
  async (): Promise<FaqViewModel[]> => {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data) {
        console.error("Failed to fetch faqs:", error?.message);
        return [];
      }
      return data.map(mapFaqRow);
    } catch (err) {
      console.error("Unexpected error fetching faqs:", err);
      return [];
    }
  },
  ["faqs"],
  { tags: ["faqs"], revalidate: 3600 },
);
