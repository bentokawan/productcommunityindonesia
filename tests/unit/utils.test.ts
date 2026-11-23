import { describe, expect, it } from "vitest";
import { formatEventDate } from "@/lib/utils";

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
