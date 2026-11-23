import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import type { AppRole } from "@/lib/auth/permissions";

export interface StaffSession {
  userId: string;
  email: string;
  fullName: string;
  role: AppRole;
}

export const getStaff = cache(async (): Promise<StaffSession | null> => {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_id, role, full_name, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile || !profile.is_active) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    role: profile.role,
  };
});

export async function requireStaff(): Promise<StaffSession> {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const staff = await getStaff();
  if (!staff) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=no-access");
  }

  return staff;
}

export async function requireAdmin(): Promise<StaffSession> {
  const staff = await requireStaff();
  if (staff.role !== "admin") {
    notFound();
  }
  return staff;
}
