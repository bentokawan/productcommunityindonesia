"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/seo";
import { createAdminServiceClient } from "@/lib/supabase/admin";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  fail,
  fromZod,
  type ActionResult,
} from "@/features/admin/ui/action-result";

const inviteSchema = z.object({
  email: z.string().trim().email("Format email belum valid."),
  full_name: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi.")
    .max(80, "Maksimal 80 karakter."),
  role: z.enum(["admin", "editor"]),
});

const updateUserSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "editor"]),
  is_active: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});

export async function inviteCmsUser(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const adminClient = createAdminServiceClient();
  const siteUrl = getSiteUrl();

  const { data: invited, error: inviteError } =
    await adminClient.auth.admin.inviteUserByEmail(parsed.data.email, {
      redirectTo: `${siteUrl}/admin/auth/confirm`,
    });

  if (inviteError || !invited.user) {
    return {
      ok: false,
      code: "conflict",
      message:
        inviteError?.message ??
        "Gagal mengundang pengguna. Pastikan email belum terdaftar.",
    };
  }

  const supabase = await createServerAuthClient();
  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: invited.user.id,
    full_name: parsed.data.full_name,
    role: parsed.data.role,
    is_active: true,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(invited.user.id);
    return fail(profileError);
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateCmsUser(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      role: parsed.data.role,
      is_active: parsed.data.is_active,
    })
    .eq("user_id", parsed.data.user_id);

  if (error) return fail(error);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeCmsUser(userId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createServerAuthClient();

  // Delete profile first so private.guard_last_admin() protects the last active admin
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("user_id", userId);

  if (profileError) return fail(profileError);

  const adminClient = createAdminServiceClient();
  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
  if (authError) {
    return {
      ok: false,
      code: "error",
      message: "Profil dihapus, tetapi gagal menghapus akun auth.",
    };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}
