"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  fail,
  fromZod,
  type ActionResult,
} from "@/features/admin/ui/action-result";
import { removeImage, uploadImage } from "@/features/admin/ui/storage";
import { eventSchema, wibLocalToIso } from "@/features/admin/events/schema";

export async function saveEvent(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = eventSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    category_id: formData.get("category_id"),
    edition_label: formData.get("edition_label"),
    speakers: formData.get("speakers"),
    starts_at_local: formData.get("starts_at_local"),
    instagram_url: formData.get("instagram_url"),
    is_published: formData.get("is_published"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { id, starts_at_local, ...rest } = parsed.data;
  const starts_at = wibLocalToIso(starts_at_local);
  const supabase = await createServerAuthClient();

  const file = formData.get("poster");
  const hasFile = file instanceof File && file.size > 0;

  let oldPath: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("events")
      .select("poster_path")
      .eq("id", id)
      .maybeSingle();
    oldPath = existing?.poster_path ?? null;
  } else if (!hasFile) {
    return {
      ok: false,
      code: "invalid",
      message: "Poster webinar wajib diunggah.",
    };
  }

  let nextPosterPath = oldPath ?? "";
  if (hasFile) {
    const uploaded = await uploadImage(file, "events");
    if (!uploaded.ok) {
      return { ok: false, code: "invalid", message: uploaded.message };
    }
    nextPosterPath = uploaded.path;
  }

  const payload = {
    ...rest,
    starts_at,
    poster_path: nextPosterPath,
  };

  const { error } = id
    ? await supabase.from("events").update(payload).eq("id", id)
    : await supabase.from("events").insert(payload);

  if (error) {
    if (hasFile) await removeImage(nextPosterPath);
    return fail(error);
  }

  if (hasFile && oldPath && oldPath !== nextPosterPath) {
    await removeImage(oldPath);
  }

  revalidateTag("events", "max");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function removeEvent(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { data: existing } = await supabase
    .from("events")
    .select("poster_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return fail(error);

  await removeImage(existing?.poster_path);
  revalidateTag("events", "max");
  revalidatePath("/admin/events");
  return { ok: true };
}
