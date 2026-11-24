import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Pagination } from "@/components/ui/pagination";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
import { WebinarCard } from "@/features/webinar/webinar-card";
import { getWebinarArchive } from "@/lib/queries/events";
import { getSiteLinks } from "@/lib/queries/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Arsip Webinar & Sharing Session",
  description:
    "Semua sesi webinar, Sharing Session, dan Riung Class bersama praktisi product digital Indonesia.",
  path: "/webinar",
});

interface WebinarArchivePageProps {
  searchParams: Promise<{
    kategori?: string;
    page?: string;
  }>;
}

export default async function WebinarArchivePage({
  searchParams,
}: WebinarArchivePageProps) {
  const params = await searchParams;
  const activeCategory = params.kategori?.trim() || "all";
  const pageNumber = Number(params.page ?? "1");

  const [links, archive] = await Promise.all([
    getSiteLinks(),
    getWebinarArchive({
      category: activeCategory === "all" ? undefined : activeCategory,
      page: Number.isFinite(pageNumber) && pageNumber >= 1 ? pageNumber : 1,
    }),
  ]);

  const tabItems = [
    { value: "all", label: "Semua", href: "/webinar" },
    ...archive.categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
      href: `/webinar?kategori=${encodeURIComponent(cat.slug)}`,
    })),
  ];

  function createPageHref(page: number) {
    const query = new URLSearchParams();
    if (activeCategory !== "all") {
      query.set("kategori", activeCategory);
    }
    if (page > 1) {
      query.set("page", String(page));
    }
    const qs = query.toString();
    return qs ? `/webinar?${qs}` : "/webinar";
  }

  return (
    <>
      <div data-tone="dark" className="bg-(--color-bg) text-(--color-fg)">
        <SiteNavbar
          whatsappUrl={links.whatsappUrl}
          instagramUrl={links.instagramUrl}
        />
      </div>

      <main id="konten" tabIndex={-1} className="outline-none">
        <Section tone="dark">
          <Container>
            <SectionHeading
              as="h1"
              align="center"
              headingMode="mount"
              eyebrow="ARSIP WEBINAR"
              title="Semua sesi Sharing Session & Riung Class"
              description="Tonton ulang dan pantau seluruh sesi diskusi bareng praktisi product Indonesia."
            />

            <div className="mt-8 md:mt-10">
              <Tabs
                items={tabItems}
                value={activeCategory}
                ariaLabel="Kategori arsip webinar"
              />
            </div>

            {archive.items.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {archive.items.map((event, idx) => (
                  <WebinarCard
                    key={event.id}
                    event={event}
                    index={idx}
                    headingAs="h2"
                  />
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-body text-(--color-fg-muted)">
                Belum ada webinar di kategori ini.
              </p>
            )}

            <Pagination
              currentPage={archive.currentPage}
              totalPages={archive.totalPages}
              createHref={createPageHref}
              className="mt-12"
            />
          </Container>
        </Section>
      </main>

      <SiteFooter links={links} />
    </>
  );
}
