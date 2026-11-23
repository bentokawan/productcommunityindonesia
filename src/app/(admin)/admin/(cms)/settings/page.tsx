import { requireAdmin } from "@/lib/auth/session";
import { getAdminSiteLinks } from "@/lib/queries/admin/admin-modules";
import { SettingsForm } from "@/features/admin/settings/settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const links = await getAdminSiteLinks();
  return <SettingsForm links={links} />;
}
