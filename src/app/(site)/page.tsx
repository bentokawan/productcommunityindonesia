import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { AboutSection } from "@/features/home/about-section";
import { ActivitiesSection } from "@/features/home/activities-section";
import { CtaBanner } from "@/features/home/cta-banner";
import { FaqSection } from "@/features/home/faq-section";
import { HeroSection } from "@/features/home/hero-section";
import { TeamSection } from "@/features/home/team-section";
import { WebinarSection } from "@/features/webinar/webinar-section";
import { getLandingData } from "@/lib/queries";
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Product Community Indonesia (PCI) — Belajar & Bertumbuh Bersama",
  description:
    "Komunitas product people Indonesia: sharing session, diskusi grup, kolaborasi project, dan gathering bersama praktisi produk digital.",
  path: "/",
});

export default async function HomePage() {
  const {
    links,
    hero,
    partners,
    activities,
    groups,
    webinar,
    team,
    faqs,
  } = await getLandingData();

  const orgJsonLd = buildOrganizationJsonLd(links);
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <main>
        <HeroSection
          links={links}
          stats={hero.stats}
          slides={hero.slides}
          partners={partners}
        />
        <AboutSection />
        <ActivitiesSection activities={activities} groups={groups} />
        <WebinarSection
          categories={webinar.categories}
          events={webinar.events}
          next={webinar.next}
          instagramUrl={links.instagramUrl}
          instagramHandle={links.instagramHandle}
        />
        <TeamSection members={team} />
        <CtaBanner
          whatsappUrl={links.whatsappUrl}
          instagramUrl={links.instagramUrl}
        />
        <FaqSection faqs={faqs} />
      </main>
      <SiteFooter links={links} />
    </>
  );
}
