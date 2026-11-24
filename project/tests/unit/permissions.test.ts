import { describe, expect, it } from "vitest";
import { can } from "@/lib/auth/permissions";

describe("RBAC permissions matrix", () => {
  it("allows editor to manage content modules but not admin-only modules", () => {
    expect(can("editor", "faqs", "create")).toBe(true);
    expect(can("editor", "events", "publish")).toBe(true);
    expect(can("editor", "events", "reorder")).toBe(false);
    expect(can("editor", "event_categories", "read")).toBe(false);
    expect(can("editor", "settings", "read")).toBe(false);
    expect(can("editor", "users", "read")).toBe(false);
    expect(can("editor", "audit_log", "read")).toBe(false);
    expect(can("editor", "account", "update")).toBe(true);
  });

  it("allows admin to access all modules with expected actions", () => {
    expect(can("admin", "event_categories", "delete")).toBe(true);
    expect(can("admin", "settings", "update")).toBe(true);
    expect(can("admin", "settings", "delete")).toBe(false);
    expect(can("admin", "users", "create")).toBe(true);
    expect(can("admin", "audit_log", "read")).toBe(true);
    expect(can("admin", "audit_log", "delete")).toBe(false);
  });
});
