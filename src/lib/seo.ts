import type { Metadata } from "next";
import type { SiteLinks } from "@/content/fallback-links";
import type { FaqViewModel } from "@/lib/queries/mappers";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Product Community Indonesia",
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildOrganizationJsonLd(links: SiteLinks) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Product Community Indonesia",
    alternateName: "PCI",
    url: siteUrl,
    description:
      "Komunitas terbuka bagi para antusias dan profesional di bidang product digital di Indonesia.",
    sameAs: [links.instagramUrl, links.linkedinUrl, links.whatsappUrl],
  };
}

export function buildFaqJsonLd(faqs: FaqViewModel[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
