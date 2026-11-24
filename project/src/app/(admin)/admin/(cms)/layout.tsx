import { requireStaff } from "@/lib/auth/session";
import { AdminShell } from "@/features/admin/shell/admin-shell";

export default async function CmsShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const staff = await requireStaff();

  return (
    <AdminShell
      user={{
        fullName: staff.fullName,
        email: staff.email,
        role: staff.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
