import { requireStaff } from "@/lib/auth/session";
import { listHeroSlides, listSiteStats } from "@/lib/queries/admin/content";
import { HeroManager } from "@/features/admin/media/hero-manager";

export default async function AdminHeroPage() {
  await requireStaff();
  const [slides, stats] = await Promise.all([
    listHeroSlides(),
    listSiteStats(),
  ]);
  return <HeroManager slides={slides} stats={stats} />;
}
