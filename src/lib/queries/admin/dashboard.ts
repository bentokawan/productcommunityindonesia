import "server-only";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import { formatEventDate } from "@/lib/utils";
import type { AdminRole } from "@/features/admin/shell/nav";

export async function getDashboardData(role: AdminRole) {
  const supabase = await createServerAuthClient();

  const [eventsRes, faqsRes, teamRes, slidesRes, logsRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, edition_label, starts_at, is_published, poster_path, instagram_url")
      .order("starts_at", { ascending: false }),
    supabase.from("faqs").select("id, is_published"),
    supabase.from("team_members").select("id, is_published"),
    supabase.from("hero_slides").select("id, alt, caption, is_published"),
    role === "admin"
      ? supabase
          .from("audit_logs")
          .select("id, table_name, action, record_id, created_at")
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
  ]);

  const events = eventsRes.data ?? [];
  const nowMs = Date.now();
  const nextWebinar =
    events
      .filter((e) => e.is_published && new Date(e.starts_at).getTime() > nowMs)
      .sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
      )[0] ?? null;

  const publishedEventsCount = events.filter((e) => e.is_published).length;
  const publishedFaqsCount = (faqsRes.data ?? []).filter(
    (f) => f.is_published,
  ).length;
  const publishedTeamCount = (teamRes.data ?? []).filter(
    (t) => t.is_published,
  ).length;

  const incompleteItems: { label: string; href: string }[] = [];
  for (const ev of events) {
    if (ev.poster_path.startsWith("placeholders/")) {
      incompleteItems.push({
        label: `Poster webinar "${ev.edition_label}" masih placeholder`,
        href: `/admin/events/${ev.id}`,
      });
    }
  }
  for (const slide of slidesRes.data ?? []) {
    if (!slide.alt.trim()) {
      incompleteItems.push({
        label: `Slide "${slide.caption}" belum punya teks alt`,
        href: "/admin/hero",
      });
    }
  }

  return {
    nextWebinar: nextWebinar
      ? {
          id: nextWebinar.id,
          title: nextWebinar.title,
          editionLabel: nextWebinar.edition_label,
          formattedDate: formatEventDate(nextWebinar.starts_at),
        }
      : null,
    metrics: {
      events: publishedEventsCount,
      faqs: publishedFaqsCount,
      team: publishedTeamCount,
    },
    incompleteItems: incompleteItems.slice(0, 6),
    recentLogs: logsRes.data ?? [],
  };
}
