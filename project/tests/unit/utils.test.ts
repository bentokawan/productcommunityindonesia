import { describe, expect, it } from "vitest";
import { cn, formatEventDate } from "@/lib/utils";

describe("cn", () => {
  it("preserves custom typography utilities alongside text color classes", () => {
    expect(cn("text-button text-ink-900")).toBe("text-button text-ink-900");
    expect(cn("text-chip text-brand-500")).toBe("text-chip text-brand-500");
    expect(cn("text-mono text-ink-900")).toBe("text-mono text-ink-900");
    expect(cn("text-body text-white/90")).toBe("text-body text-white/90");
    expect(cn("text-tab text-(--color-fg)")).toBe("text-tab text-(--color-fg)");
    expect(cn("admin-text-body text-admin-ink")).toBe(
      "admin-text-body text-admin-ink",
    );
  });

  it("still merges conflicting custom typography utilities", () => {
    expect(cn("text-body text-meta")).toBe("text-meta");
    expect(cn("text-h2 text-display")).toBe("text-display");
    expect(cn("admin-text-body admin-text-label")).toBe("admin-text-label");
  });
});

describe("formatEventDate", () => {
  it("formats ISO timestamp in Asia/Jakarta with Indonesian locale", () => {
    // 2026-11-04T19:00:00+07:00 is Wednesday, 4 Nov 2026
    expect(formatEventDate("2026-11-04T12:00:00Z")).toBe("Rabu, 4 Nov 2026");
  });

  it("uses Asia/Jakarta timezone across midnight UTC", () => {
    // 2026-11-04T18:00:00Z is 2026-11-05 01:00 WIB (Kamis, 5 Nov 2026)
    expect(formatEventDate("2026-11-04T18:00:00Z")).toBe("Kamis, 5 Nov 2026");
  });

  it("returns empty string for invalid dates", () => {
    expect(formatEventDate("invalid-date")).toBe("");
  });
});
