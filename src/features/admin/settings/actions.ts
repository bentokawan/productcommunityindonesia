"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  fail,
  fromZod,
  type ActionResult,
} from "@/features/admin/ui/action-result";

const siteLinksSchema = z.object({
  whatsapp_url: z
    .string()
    .trim()
    .max(500)
    .regex(/^https:\/\//, "URL harus diawali https://."),
  instagram_url: z
    .string()
    .trim()
    .max(500)
    .regex(/^https:\/\//, "URL harus diawali https://."),
  instagram_handle: z
    .string()
    .trim()
    .min(1, "Handle Instagram wajib diisi.")
    .max(100),
  linkedin_url: z
    .string()
    .trim()
    .max(500)
    .regex(/^https:\/\//, "URL harus diawali https://."),
});

export async function saveSiteLinks(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = siteLinksSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const rows = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value,
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return fail(error);
  revalidateTag("site_settings", "max");
  revalidatePath("/admin/settings");
  return { ok: true };
}
