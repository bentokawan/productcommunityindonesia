"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import { getSiteUrl } from "@/lib/seo";
import { fromZod, type ActionResult } from "@/features/admin/ui/action-result";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  usernameToAuthEmail,
} from "@/features/admin/auth/schema";

export async function loginWithPassword(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToAuthEmail(parsed.data.username),
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      ok: false,
      code: "invalid",
      message: "Username atau password belum sesuai. Coba cek lagi ya.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return {
      ok: false,
      code: "forbidden",
      message: "Akun kamu belum punya akses CMS.",
    };
  }

  const next = parsed.data.next;
  const target = next && next.startsWith("/admin") ? next : "/admin";
  redirect(target);
}

export async function requestPasswordReset(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const siteUrl = getSiteUrl();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/admin/auth/confirm`,
  });

  // Always return ok to avoid leaking whether an email is registered
  return { ok: true };
}

export async function updatePasswordFromReset(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      code: "error",
      message:
        "Link reset sudah kedaluwarsa atau tidak valid. Minta link baru ya.",
    };
  }

  redirect("/admin");
}
