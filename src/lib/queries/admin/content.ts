import "server-only";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import type { Tables } from "@/lib/supabase/database.types";

export async function listActivities(): Promise<Tables<"activities">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listPartners(): Promise<Tables<"partners">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listHeroSlides(): Promise<Tables<"hero_slides">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listSiteStats(): Promise<Tables<"site_stats">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("site_stats")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCommunityGroups(): Promise<
  Tables<"community_groups">[]
> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("community_groups")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listTeamMembers(): Promise<Tables<"team_members">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listEventCategories(): Promise<
  Tables<"event_categories">[]
> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("event_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export type AdminEventRow = Tables<"events"> & {
  event_categories: Pick<Tables<"event_categories">, "id" | "name" | "slug"> | null;
};

export async function listEvents(): Promise<AdminEventRow[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_categories(id, name, slug)")
    .order("starts_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminEventRow[];
}

export async function getEventById(
  id: string,
): Promise<Tables<"events"> | null> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
