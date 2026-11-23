import { requireStaff } from "@/lib/auth/session";
import { AccountForm } from "@/features/admin/account/account-form";

export default async function AdminAccountPage() {
  const staff = await requireStaff();
  return <AccountForm fullName={staff.fullName} email={staff.email} />;
}
