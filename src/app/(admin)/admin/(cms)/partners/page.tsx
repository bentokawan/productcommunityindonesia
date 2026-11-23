import { requireStaff } from "@/lib/auth/session";
import { listPartners } from "@/lib/queries/admin/content";
import { PartnersManager } from "@/features/admin/content/partners-manager";

export default async function AdminPartnersPage() {
  await requireStaff();
  const rows = await listPartners();
  return <PartnersManager initialRows={rows} />;
}
