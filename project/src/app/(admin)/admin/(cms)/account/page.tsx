import { requireStaff } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  getAdminSiteLinks,
  listProfiles,
} from "@/lib/queries/admin/admin-modules";
import {
  AccountForm,
  type AccountTabId,
} from "@/features/admin/account/account-form";

interface AdminAccountPageProps {
  searchParams: Promise<{ tab?: string }>;
}

const VALID_TABS = new Set<AccountTabId>([
  "profile",
  "security",
  "google",
  "links",
  "users",
]);

export default async function AdminAccountPage({
  searchParams,
}: AdminAccountPageProps) {
  const staff = await requireStaff();
  const [supabase, params] = await Promise.all([
    createServerAuthClient(),
    searchParams,
  ]);

  const [{ data: authData }, adminData] = await Promise.all([
    supabase.auth.getUser(),
    staff.role === "admin"
      ? Promise.all([getAdminSiteLinks(), listProfiles()])
      : Promise.resolve(null),
  ]);

  const googleIdentity = authData.user?.identities?.find(
    (identity) => identity.provider === "google",
  );
  const googleEmail =
    typeof googleIdentity?.identity_data?.email === "string"
      ? googleIdentity.identity_data.email
      : null;

  const requestedTab = params.tab as AccountTabId | undefined;
  const initialTab: AccountTabId =
    requestedTab &&
    VALID_TABS.has(requestedTab) &&
    (staff.role === "admin" ||
      (requestedTab !== "links" && requestedTab !== "users"))
      ? requestedTab
      : "profile";

  return (
    <AccountForm
      userId={staff.userId}
      fullName={staff.fullName}
      email={staff.email}
      role={staff.role}
      googleLinked={Boolean(googleIdentity)}
      googleEmail={googleEmail}
      siteLinks={adminData?.[0]}
      profiles={adminData?.[1]}
      initialTab={initialTab}
    />
  );
}
