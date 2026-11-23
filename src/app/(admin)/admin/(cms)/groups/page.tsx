import { requireStaff } from "@/lib/auth/session";
import { listCommunityGroups } from "@/lib/queries/admin/content";
import { GroupsManager } from "@/features/admin/media/groups-manager";

export default async function AdminGroupsPage() {
  await requireStaff();
  const rows = await listCommunityGroups();
  return <GroupsManager initialRows={rows} />;
}
