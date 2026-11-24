import { requireStaff } from "@/lib/auth/session";
import { listActivities } from "@/lib/queries/admin/content";
import { ActivitiesManager } from "@/features/admin/content/activities-manager";

export default async function AdminActivitiesPage() {
  await requireStaff();
  const rows = await listActivities();
  return <ActivitiesManager initialRows={rows} />;
}
