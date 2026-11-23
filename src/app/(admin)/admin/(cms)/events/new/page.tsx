import { requireStaff } from "@/lib/auth/session";
import { listEventCategories } from "@/lib/queries/admin/content";
import { EventForm } from "@/features/admin/events/event-form";

export default async function AdminNewEventPage() {
  await requireStaff();
  const categories = await listEventCategories();
  return <EventForm event={null} categories={categories} />;
}
