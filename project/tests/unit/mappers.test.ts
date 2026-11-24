import { describe, expect, it } from "vitest";
import {
  mapEventRow,
  mapSiteSettings,
  mapSlideRow,
  pickNextWebinar,
  type EventWithCategoryRow,
} from "@/lib/queries/mappers";
import { FALLBACK_LINKS } from "@/content/fallback-links";

describe("query mappers", () => {
  it("falls back to default links when site_settings is empty", () => {
    expect(mapSiteSettings([])).toEqual(FALLBACK_LINKS);
  });

  it("maps hero slide caption_long fallback to caption", () => {
    const slide = mapSlideRow({
      id: "s1",
      image_path: "placeholders/slide-1.svg",
      alt: "Alt text",
      caption: "Short",
      caption_long: null,
      sort_order: 1,
      is_published: true,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
    expect(slide.imageUrl).toBe("/placeholders/slide-1.svg");
    expect(slide.captionLong).toBe("Short");
  });

  it("maps local images/ paths cleanly to root-relative URLs", () => {
    const slide = mapSlideRow({
      id: "s2",
      image_path: "images/hero/slide-01-ipc-2026.png",
      alt: "IPC 2026",
      caption: "PCI × IPC 2026",
      caption_long: "PCI × INDONESIA PRODUCT CONFERENCE 2026",
      sort_order: 1,
      is_published: true,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
    expect(slide.imageUrl).toBe("/images/hero/slide-01-ipc-2026.png");
    expect(slide.captionLong).toBe("PCI × INDONESIA PRODUCT CONFERENCE 2026");
  });

  it("maps event row and picks earliest upcoming webinar", () => {
    const rows: EventWithCategoryRow[] = [
      {
        id: "e1",
        slug: "past-event",
        category_id: "c1",
        edition_label: "#1",
        title: "Past",
        speakers: "A",
        poster_path: "placeholders/webinar-1.svg",
        starts_at: "2026-01-01T12:00:00Z",
        instagram_url: "https://www.instagram.com/productcommunityid/",
        is_published: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        event_categories: { slug: "sharing-session", name: "Sharing Session" },
      },
      {
        id: "e2",
        slug: "later-event",
        category_id: "c1",
        edition_label: "#2",
        title: "Later",
        speakers: "B",
        poster_path: "events/poster.png",
        starts_at: "2026-12-20T12:00:00Z",
        instagram_url: "https://www.instagram.com/productcommunityid/",
        is_published: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        event_categories: { slug: "sharing-session", name: "Sharing Session" },
      },
      {
        id: "e3",
        slug: "soon-event",
        category_id: "c2",
        edition_label: "#3",
        title: "Soon",
        speakers: "C",
        poster_path: "placeholders/webinar-2.svg",
        starts_at: "2026-12-01T12:00:00Z",
        instagram_url: "https://www.instagram.com/productcommunityid/",
        is_published: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        event_categories: { slug: "riung-class", name: "Riung Class" },
      },
    ];

    const mapped = rows.map(mapEventRow);
    const next = pickNextWebinar(mapped, new Date("2026-11-23T00:00:00Z"));
    expect(next?.slug).toBe("soon-event");
    expect(pickNextWebinar(mapped, new Date("2027-01-01T00:00:00Z"))).toBeNull();
  });
});
