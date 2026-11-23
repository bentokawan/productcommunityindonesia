import "server-only";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import type { Tables } from "@/lib/supabase/database.types";
import { FALLBACK_LINKS, type SiteLinks } from "@/content/fallback-links";
import { mapSiteSettings } from "@/lib/queries/mappers";

export async function getAdminSiteLinks(): Promise<SiteLinks> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error || !data) return FALLBACK_LINKS;
  return mapSiteSettings(data);
}

export async function listProfiles(): Promise<Tables<"profiles">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAuditLogs(): Promise<Tables<"audit_logs">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
}
