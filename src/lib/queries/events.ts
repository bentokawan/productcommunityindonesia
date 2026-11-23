import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/server";
import {
  mapEventCategoryRow,
  mapEventRow,
  pickNextWebinar,
  type EventCategoryViewModel,
  type EventWithCategoryRow,
  type WebinarCardData,
} from "@/lib/queries/mappers";

export const WEBINAR_PREVIEW_LIMIT = 6;
export const WEBINAR_ARCHIVE_PAGE_SIZE = 12;

export const getWebinarSection = unstable_cache(
  async (): Promise<{
    categories: EventCategoryViewModel[];
    events: WebinarCardData[];
    next: WebinarCardData | null;
  }> => {
    try {
      const supabase = createPublicServerClient();
      const [categoriesRes, eventsRes] = await Promise.all([
        supabase
          .from("event_categories")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("events")
          .select("*, event_categories(slug, name)")
          .eq("is_published", true)
          .order("starts_at", { ascending: false }),
      ]);

      if (categoriesRes.error) {
        console.error(
          "Failed to fetch event_categories:",
          categoriesRes.error.message,
        );
      }
      if (eventsRes.error) {
        console.error("Failed to fetch events:", eventsRes.error.message);
      }

      const mappedEvents = ((eventsRes.data ?? []) as EventWithCategoryRow[]).map(
        mapEventRow,
      );

      return {
        categories: (categoriesRes.data ?? []).map(mapEventCategoryRow),
        events: mappedEvents.slice(0, WEBINAR_PREVIEW_LIMIT),
        next: pickNextWebinar(mappedEvents),
      };
    } catch (err) {
      console.error("Unexpected error fetching webinar section:", err);
      return { categories: [], events: [], next: null };
    }
  },
  ["webinar_section"],
  { tags: ["events", "event_categories"], revalidate: 3600 },
);

export async function getWebinarArchive({
  category,
  page = 1,
}: {
  category?: string;
  page?: number;
}): Promise<{
  categories: EventCategoryViewModel[];
  items: WebinarCardData[];
  totalPages: number;
  currentPage: number;
}> {
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const cached = unstable_cache(
    async () => {
      try {
        const supabase = createPublicServerClient();
        const [categoriesRes, eventsRes] = await Promise.all([
          supabase
            .from("event_categories")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true }),
          supabase
            .from("events")
            .select("*, event_categories(slug, name)")
            .eq("is_published", true)
            .order("starts_at", { ascending: false }),
        ]);

        const categories = (categoriesRes.data ?? []).map(mapEventCategoryRow);
        const allEvents = (
          (eventsRes.data ?? []) as EventWithCategoryRow[]
        ).map(mapEventRow);

        const filtered =
          category && category !== "all"
            ? allEvents.filter((e) => e.categorySlug === category)
            : allEvents;

        const totalPages = Math.max(
          1,
          Math.ceil(filtered.length / WEBINAR_ARCHIVE_PAGE_SIZE),
        );
        const clampedPage = Math.min(safePage, totalPages);
        const offset = (clampedPage - 1) * WEBINAR_ARCHIVE_PAGE_SIZE;

        return {
          categories,
          items: filtered.slice(offset, offset + WEBINAR_ARCHIVE_PAGE_SIZE),
          totalPages,
          currentPage: clampedPage,
        };
      } catch (err) {
        console.error("Unexpected error fetching webinar archive:", err);
        return {
          categories: [],
          items: [],
          totalPages: 1,
          currentPage: 1,
        };
      }
    },
    ["webinar_archive", category ?? "all", String(safePage)],
    { tags: ["events", "event_categories"], revalidate: 3600 },
  );

  return cached();
}
