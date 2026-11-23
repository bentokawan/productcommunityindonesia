"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  fail,
  fromZod,
  type ActionResult,
} from "@/features/admin/ui/action-result";
import { nextSortOrder, swapSortOrder } from "@/features/admin/ui/sort";
import { faqSchema } from "@/features/admin/faqs/schema";

function revalidateFaqs() {
  revalidateTag("faqs", "max");
  revalidatePath("/admin/faqs");
}

export async function saveFaq(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();

  const { error } = id
    ? await supabase.from("faqs").update(values).eq("id", id)
    : await supabase.from("faqs").insert({
        ...values,
        sort_order: await nextSortOrder(supabase, "faqs"),
      });

  if (error) return fail(error);
  revalidateFaqs();
  return { ok: true };
}

export async function removeFaq(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return fail(error);
  revalidateFaqs();
  return { ok: true };
}

export async function moveFaq(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "faqs", id, direction);
  if (!res.ok) return res;
  revalidateFaqs();
  return { ok: true };
}
