import "server-only";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import type { Tables } from "@/lib/supabase/database.types";

export async function listFaqs(): Promise<Tables<"faqs">[]> {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
