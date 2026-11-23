import { requireStaff } from "@/lib/auth/session";
import { listTeamMembers } from "@/lib/queries/admin/content";
import { TeamManager } from "@/features/admin/media/team-manager";

export default async function AdminTeamPage() {
  await requireStaff();
  const rows = await listTeamMembers();
  return <TeamManager initialRows={rows} />;
}
