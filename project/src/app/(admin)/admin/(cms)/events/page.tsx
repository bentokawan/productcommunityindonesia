import { requireStaff } from "@/lib/auth/session";
import { listEventCategories, listEvents } from "@/lib/queries/admin/content";
import { EventsManager } from "@/features/admin/events/events-manager";

export default async function AdminEventsPage() {
  await requireStaff();
  const [rows, categories] = await Promise.all([
    listEvents(),
    listEventCategories(),
  ]);
  return <EventsManager initialRows={rows} categories={categories} />;
}
