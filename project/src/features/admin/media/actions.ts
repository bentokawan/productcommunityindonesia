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
import { removeImage, uploadImage } from "@/features/admin/ui/storage";
import {
  communityGroupSchema,
  heroSlideSchema,
  siteStatSchema,
  teamMemberSchema,
} from "@/features/admin/media/schemas";

export async function saveSiteStat(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = siteStatSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();

  if (!id) {
    const { count } = await supabase
      .from("site_stats")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) >= 4) {
      return {
        ok: false,
        code: "conflict",
        message: "Statistik hero maksimal 4 item.",
      };
    }
  }

  const { error } = id
    ? await supabase.from("site_stats").update(values).eq("id", id)
    : await supabase.from("site_stats").insert({
        ...values,
        sort_order: await nextSortOrder(supabase, "site_stats"),
      });

  if (error) return fail(error);
  revalidateTag("site_stats", "max");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function removeSiteStat(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { error } = await supabase.from("site_stats").delete().eq("id", id);
  if (error) return fail(error);
  revalidateTag("site_stats", "max");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function moveSiteStat(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "site_stats", id, direction);
  if (!res.ok) return res;
  revalidateTag("site_stats", "max");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function saveHeroSlide(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = heroSlideSchema.safeParse({
    id: formData.get("id") || undefined,
    alt: formData.get("alt"),
    caption: formData.get("caption"),
    caption_long: formData.get("caption_long"),
    is_published: formData.get("is_published"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();
  const file = formData.get("image");
  const hasFile = file instanceof File && file.size > 0;

  let oldPath: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("hero_slides")
      .select("image_path")
      .eq("id", id)
      .maybeSingle();
    oldPath = existing?.image_path ?? null;
  } else if (!hasFile) {
    return {
      ok: false,
      code: "invalid",
      message: "Gambar slide wajib diunggah.",
    };
  }

  let nextImagePath = oldPath ?? "";
  if (hasFile) {
    const uploaded = await uploadImage(file, "hero");
    if (!uploaded.ok) {
      return { ok: false, code: "invalid", message: uploaded.message };
    }
    nextImagePath = uploaded.path;
  }

  const { error } = id
    ? await supabase
        .from("hero_slides")
        .update({ ...values, image_path: nextImagePath })
        .eq("id", id)
    : await supabase.from("hero_slides").insert({
        ...values,
        image_path: nextImagePath,
        sort_order: await nextSortOrder(supabase, "hero_slides"),
      });

  if (error) {
    if (hasFile) await removeImage(nextImagePath);
    return fail(error);
  }

  if (hasFile && oldPath && oldPath !== nextImagePath) {
    await removeImage(oldPath);
  }

  revalidateTag("hero_slides", "max");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function removeHeroSlide(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { data: existing } = await supabase
    .from("hero_slides")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return fail(error);
  await removeImage(existing?.image_path);
  revalidateTag("hero_slides", "max");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function moveHeroSlide(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "hero_slides", id, direction);
  if (!res.ok) return res;
  revalidateTag("hero_slides", "max");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function saveCommunityGroup(
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const parsed = communityGroupSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();
  const file = formData.get("logo");
  const hasFile = file instanceof File && file.size > 0;

  let oldPath: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("community_groups")
      .select("logo_path")
      .eq("id", id)
      .maybeSingle();
    oldPath = existing?.logo_path ?? null;
  } else if (!hasFile) {
    return { ok: false, code: "invalid", message: "Logo grup wajib diunggah." };
  }

  let nextLogoPath = oldPath ?? "";
  if (hasFile) {
    const uploaded = await uploadImage(file, "groups");
    if (!uploaded.ok) {
      return { ok: false, code: "invalid", message: uploaded.message };
    }
    nextLogoPath = uploaded.path;
  }

  const { error } = id
    ? await supabase
        .from("community_groups")
        .update({ ...values, logo_path: nextLogoPath })
        .eq("id", id)
    : await supabase.from("community_groups").insert({
        ...values,
        logo_path: nextLogoPath,
        sort_order: await nextSortOrder(supabase, "community_groups"),
      });

  if (error) {
    if (hasFile) await removeImage(nextLogoPath);
    return fail(error);
  }

  if (hasFile && oldPath && oldPath !== nextLogoPath) {
    await removeImage(oldPath);
  }

  revalidateTag("community_groups", "max");
  revalidatePath("/admin/groups");
  return { ok: true };
}

export async function removeCommunityGroup(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { data: existing } = await supabase
    .from("community_groups")
    .select("logo_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("community_groups")
    .delete()
    .eq("id", id);
  if (error) return fail(error);
  await removeImage(existing?.logo_path);
  revalidateTag("community_groups", "max");
  revalidatePath("/admin/groups");
  return { ok: true };
}

export async function moveCommunityGroup(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "community_groups", id, direction);
  if (!res.ok) return res;
  revalidateTag("community_groups", "max");
  revalidatePath("/admin/groups");
  return { ok: true };
}

export async function saveTeamMember(
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const parsed = teamMemberSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    role: formData.get("role"),
    linkedin_url: formData.get("linkedin_url"),
    is_published: formData.get("is_published"),
  });
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();
  const file = formData.get("photo");
  const hasFile = file instanceof File && file.size > 0;

  let oldPath: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("team_members")
      .select("photo_path")
      .eq("id", id)
      .maybeSingle();
    oldPath = existing?.photo_path ?? null;
  } else if (!hasFile) {
    return {
      ok: false,
      code: "invalid",
      message: "Foto pengurus wajib diunggah.",
    };
  }

  let nextPhotoPath = oldPath ?? "";
  if (hasFile) {
    const uploaded = await uploadImage(file, "team");
    if (!uploaded.ok) {
      return { ok: false, code: "invalid", message: uploaded.message };
    }
    nextPhotoPath = uploaded.path;
  }

  const { error } = id
    ? await supabase
        .from("team_members")
        .update({ ...values, photo_path: nextPhotoPath })
        .eq("id", id)
    : await supabase.from("team_members").insert({
        ...values,
        photo_path: nextPhotoPath,
        sort_order: await nextSortOrder(supabase, "team_members"),
      });

  if (error) {
    if (hasFile) await removeImage(nextPhotoPath);
    return fail(error);
  }

  if (hasFile && oldPath && oldPath !== nextPhotoPath) {
    await removeImage(oldPath);
  }

  revalidateTag("team_members", "max");
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function removeTeamMember(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const { data: existing } = await supabase
    .from("team_members")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return fail(error);
  await removeImage(existing?.photo_path);
  revalidateTag("team_members", "max");
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function moveTeamMember(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createServerAuthClient();
  const res = await swapSortOrder(supabase, "team_members", id, direction);
  if (!res.ok) return res;
  revalidateTag("team_members", "max");
  revalidatePath("/admin/team");
  return { ok: true };
}
