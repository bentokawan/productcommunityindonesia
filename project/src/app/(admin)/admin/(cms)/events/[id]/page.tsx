import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/session";
import { getEventById, listEventCategories } from "@/lib/queries/admin/content";
import { EventForm } from "@/features/admin/events/event-form";

export default async function AdminEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const [event, categories] = await Promise.all([
    getEventById(id),
    listEventCategories(),
  ]);
  if (!event) notFound();
  return <EventForm event={event} categories={categories} />;
}
