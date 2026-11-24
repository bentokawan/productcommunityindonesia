import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { fail, type ActionResult } from "@/features/admin/ui/action-result";

export type SortableTable =
  | "site_stats"
  | "hero_slides"
  | "partners"
  | "activities"
  | "community_groups"
  | "event_categories"
  | "team_members"
  | "faqs";

export async function nextSortOrder(
  supabase: SupabaseClient<Database>,
  table: SortableTable,
): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const maxOrder = data?.[0]?.sort_order ?? 0;
  return maxOrder + 1;
}

export async function swapSortOrder(
  supabase: SupabaseClient<Database>,
  table: SortableTable,
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const { data: rows, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !rows) return fail(error ?? {});
  const i = rows.findIndex((r) => r.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  const a = rows[i];
  const b = rows[j];
  if (!a || !b) return { ok: true };

  const orderA = a.sort_order === b.sort_order ? i : a.sort_order;
  const orderB = a.sort_order === b.sort_order ? j : b.sort_order;

  const res1 = await supabase
    .from(table)
    .update({ sort_order: orderB })
    .eq("id", a.id);
  if (res1.error) return fail(res1.error);

  const res2 = await supabase
    .from(table)
    .update({ sort_order: orderA })
    .eq("id", b.id);
  if (res2.error) return fail(res2.error);

  return { ok: true };
}
