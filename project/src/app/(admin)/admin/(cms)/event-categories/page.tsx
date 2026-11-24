import { requireAdmin } from "@/lib/auth/session";
import { listEventCategories } from "@/lib/queries/admin/content";
import { CategoriesManager } from "@/features/admin/content/categories-manager";

export default async function AdminEventCategoriesPage() {
  await requireAdmin();
  const rows = await listEventCategories();
  return <CategoriesManager initialRows={rows} />;
}
