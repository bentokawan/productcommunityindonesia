import { describe, expect, it } from "vitest";
import { faqSchema } from "@/features/admin/faqs/schema";
import {
  activitySchema,
  eventCategorySchema,
  partnerSchema,
} from "@/features/admin/content/schemas";
import { eventSchema, isoToWibLocal, wibLocalToIso } from "@/features/admin/events/schema";

describe("CMS zod schemas", () => {
  it("validates FAQ schema and checkbox coercion", () => {
    const ok = faqSchema.safeParse({
      question: "Apakah gratis?",
      answer: "Ya, gratis.",
      is_published: "on",
    });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.is_published).toBe(true);

    const bad = faqSchema.safeParse({
      question: " ",
      answer: "Isi",
      is_published: false,
    });
    expect(bad.success).toBe(false);
  });

  it("validates activity emoji length and partner https URL", () => {
    expect(
      activitySchema.safeParse({
        emoji: "🎙️",
        title: "Sharing",
        description: "Deskripsi",
      }).success,
    ).toBe(true);

    expect(
      partnerSchema.safeParse({
        name: "Partner",
        url: "http://insecure.example.com",
      }).success,
    ).toBe(false);

    expect(
      partnerSchema.safeParse({
        name: "Partner",
        url: "",
      }).success,
    ).toBe(true);
  });

  it("validates event category slug and event WIB conversion", () => {
    expect(
      eventCategorySchema.safeParse({
        name: "Sharing Session",
        slug: "sharing-session",
      }).success,
    ).toBe(true);

    expect(
      eventCategorySchema.safeParse({
        name: "Invalid",
        slug: "Invalid Slug!",
      }).success,
    ).toBe(false);

    const iso = wibLocalToIso("2026-11-04T19:00");
    expect(iso).toBe("2026-11-04T12:00:00.000Z");
    expect(isoToWibLocal(iso)).toBe("2026-11-04T19:00");

    expect(
      eventSchema.safeParse({
        title: "Webinar Test",
        slug: "webinar-test",
        category_id: "00000000-0000-4000-8000-000000000001",
        edition_label: "#1",
        speakers: "A · B",
        starts_at_local: "2026-11-04T19:00",
        instagram_url: "https://example.com/not-ig",
        is_published: true,
      }).success,
    ).toBe(false);
  });
});
