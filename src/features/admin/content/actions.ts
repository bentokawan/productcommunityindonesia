"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, requireStaff } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  fail,
  fromZod,
  type ActionResult,
} from "@/features/admin/ui/action-result";
import { nextSortOrder, swapSortOrder } from "@/features/admin/ui/sort";
import {
  activitySchema,
  eventCategorySchema,
  partnerSchema,
} from "@/features/admin/content/schemas";

export async function saveActivity(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = activitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();

  const { error } = id
    ? await supabase.from("activities").update(values).eq("id", id)
    : await supabase.from("activities").insert({
        ...values,
        sort_order: await nextSortOrder(supabase, "activities"),
      });

  if (error) return fail(error);
  revalidateTag("activities", "max");
  revalidatePath("/admin/activities");
  return { ok: true };
}

export async function removeActivity(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) return fail(error);
  revalidateTag("activities", "max");
  revalidatePath("/admin/activities");
  return { ok: true };
}

export async function moveActivity(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "activities", id, direction);
  if (!res.ok) return res;
  revalidateTag("activities", "max");
  revalidatePath("/admin/activities");
  return { ok: true };
}

export async function savePartner(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = partnerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();

  const { error } = id
    ? await supabase.from("partners").update(values).eq("id", id)
    : await supabase.from("partners").insert({
        ...values,
        sort_order: await nextSortOrder(supabase, "partners"),
      });

  if (error) return fail(error);
  revalidateTag("partners", "max");
  revalidatePath("/admin/partners");
  return { ok: true };
}

export async function removePartner(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) return fail(error);
  revalidateTag("partners", "max");
  revalidatePath("/admin/partners");
  return { ok: true };
}

export async function movePartner(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "partners", id, direction);
  if (!res.ok) return res;
  revalidateTag("partners", "max");
  revalidatePath("/admin/partners");
  return { ok: true };
}

export async function saveEventCategory(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();

  const { error } = id
    ? await supabase.from("event_categories").update(values).eq("id", id)
    : await supabase.from("event_categories").insert({
        ...values,
        sort_order: await nextSortOrder(supabase, "event_categories"),
      });

  if (error) return fail(error);
  revalidateTag("event_categories", "max");
  revalidatePath("/admin/event-categories");
  return { ok: true };
}

export async function removeEventCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createServerAuthClient();
  const { error } = await supabase
    .from("event_categories")
    .delete()
    .eq("id", id);
  if (error) return fail(error);
  revalidateTag("event_categories", "max");
  revalidatePath("/admin/event-categories");
  return { ok: true };
}

export async function moveEventCategory(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "event_categories", id, direction);
  if (!res.ok) return res;
  revalidateTag("event_categories", "max");
  revalidatePath("/admin/event-categories");
  return { ok: true };
}
