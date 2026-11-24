import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  await requireAdmin();
  redirect("/admin/account?tab=links");
}
