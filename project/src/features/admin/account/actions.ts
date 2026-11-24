"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  fail,
  fromZod,
  type ActionResult,
} from "@/features/admin/ui/action-result";

const profileNameSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi.")
    .max(80, "Maksimal 80 karakter."),
});

const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password minimal 10 karakter.")
      .max(128, "Maksimal 128 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });

export async function updateMyName(formData: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  const parsed = profileNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("user_id", staff.userId);

  if (error) return fail(error);
  revalidatePath("/admin/account");
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updateMyPassword(
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      code: "error",
      message: "Gagal memperbarui password. Coba lagi sebentar.",
    };
  }

  return { ok: true };
}
