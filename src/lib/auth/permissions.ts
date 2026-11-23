export type AppRole = "admin" | "editor";

export type CmsModule =
  | "dashboard"
  | "hero_slides"
  | "site_stats"
  | "partners"
  | "activities"
  | "groups"
  | "team"
  | "faqs"
  | "events"
  | "event_categories"
  | "settings"
  | "users"
  | "audit_log"
  | "account";

export type CmsAction = "read" | "create" | "update" | "delete" | "reorder" | "publish";

const FULL_CONTENT_ACTIONS: readonly CmsAction[] = [
  "read",
  "create",
  "update",
  "delete",
  "reorder",
  "publish",
];

const LIST_CONTENT_ACTIONS: readonly CmsAction[] = [
  "read",
  "create",
  "update",
  "delete",
  "reorder",
];

export const ROLE_PERMISSIONS: Record<
  AppRole,
  Partial<Record<CmsModule, readonly CmsAction[]>>
> = {
  editor: {
    dashboard: ["read"],
    hero_slides: FULL_CONTENT_ACTIONS,
    site_stats: LIST_CONTENT_ACTIONS,
    partners: LIST_CONTENT_ACTIONS,
    activities: LIST_CONTENT_ACTIONS,
    groups: LIST_CONTENT_ACTIONS,
    team: FULL_CONTENT_ACTIONS,
    faqs: FULL_CONTENT_ACTIONS,
    events: ["read", "create", "update", "delete", "publish"],
    account: ["read", "update"],
  },
  admin: {
    dashboard: ["read"],
    hero_slides: FULL_CONTENT_ACTIONS,
    site_stats: LIST_CONTENT_ACTIONS,
    partners: LIST_CONTENT_ACTIONS,
    activities: LIST_CONTENT_ACTIONS,
    groups: LIST_CONTENT_ACTIONS,
    team: FULL_CONTENT_ACTIONS,
    faqs: FULL_CONTENT_ACTIONS,
    events: ["read", "create", "update", "delete", "publish"],
    event_categories: LIST_CONTENT_ACTIONS,
    settings: ["read", "update"],
    users: ["read", "create", "update", "delete"],
    audit_log: ["read"],
    account: ["read", "update"],
  },
};

export function can(role: AppRole, module: CmsModule, action: CmsAction): boolean {
  const allowed = ROLE_PERMISSIONS[role]?.[module];
  if (!allowed) return false;
  return allowed.includes(action);
}
