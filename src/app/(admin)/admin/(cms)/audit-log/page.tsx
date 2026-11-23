import { requireAdmin } from "@/lib/auth/session";
import { listAuditLogs } from "@/lib/queries/admin/admin-modules";
import { AuditLogViewer } from "@/features/admin/audit-log/audit-log-viewer";

export default async function AdminAuditLogPage() {
  await requireAdmin();
  const rows = await listAuditLogs();
  return <AuditLogViewer rows={rows} />;
}
