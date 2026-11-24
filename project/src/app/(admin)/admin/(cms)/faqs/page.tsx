import { requireStaff } from "@/lib/auth/session";
import { listFaqs } from "@/lib/queries/admin/faqs";
import { FaqManager } from "@/features/admin/faqs/faq-manager";

export default async function AdminFaqsPage() {
  await requireStaff();
  const rows = await listFaqs();
  return <FaqManager initialRows={rows} />;
}
