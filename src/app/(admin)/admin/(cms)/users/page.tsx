import { requireAdmin } from "@/lib/auth/session";
import { listProfiles } from "@/lib/queries/admin/admin-modules";
import { UsersManager } from "@/features/admin/users/users-manager";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const rows = await listProfiles();
  return <UsersManager initialRows={rows} currentUserId={admin.userId} />;
}
