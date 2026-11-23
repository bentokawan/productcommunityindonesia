"use client";

import Image from "next/image";
import { Fragment } from "react";
import { Container } from "@/components/layout/container";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/features/home/hero-slider";
import { PartnerStrip } from "@/features/home/partner-strip";
import { trackCtaClick } from "@/lib/analytics";
import type { SiteLinks } from "@/content/fallback-links";
import type {
  PartnerViewModel,
  SlideViewModel,
  StatViewModel,
} from "@/lib/queries/mappers";

export interface HeroSectionProps {
  links: SiteLinks;
  stats: StatViewModel[];
  slides: SlideViewModel[];
  partners: PartnerViewModel[];
}

export function HeroSection({
  links,
  stats,
  slides,
  partners,
}: HeroSectionProps) {
  return (
    <div
      id="top"
      data-tone="dark"
      className="relative overflow-x-clip bg-(--color-bg) text-(--color-fg)"
    >
      <Image
        src="/ornaments/hero-circle-lg.svg"
        alt=""
        width={560}
        height={560}
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 hidden select-none md:block"
      />
      <Image
        src="/ornaments/hero-circle-sm.svg"
        alt=""
        width={240}
        height={240}
        aria-hidden="true"
        className="pointer-events-none absolute top-72 -left-28 hidden select-none xl:block"
      />

      <SiteNavbar
        whatsappUrl={links.whatsappUrl}
        instagramUrl={links.instagramUrl}
      />

      <section className="relative z-10 pt-10 pb-12 md:pt-14 md:pb-16 xl:pt-16 xl:pb-20">
        <Container>
          <div className="grid items-center gap-10 xl:grid-cols-[600px_540px] xl:justify-between">
            <div>
              <Badge variant="pill">
                <span aria-hidden="true">💡</span>
                <span>Step by step, sampai idenya nyala</span>
              </Badge>

              <h1 className="mt-6 max-w-[600px] text-display heading-em text-white">
                Belajar &amp; Bertumbuh Bersama{" "}
                <em>Komunitas Product Indonesia</em>
              </h1>

              <p className="mt-5 max-w-[540px] text-lead text-stone-300">
                Dari diskusi hingga kolaborasi nyata, kami hadir untuk mendukung
                perjalananmu menjadi praktisi produk yang adaptif dan relevan di
                industri digital.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  variant="primary"
                  external
                  href={links.whatsappUrl}
                  onClick={() => trackCtaClick("hero", "whatsapp")}
                  className="w-full sm:w-auto"
                >
                  Gabung Grup WhatsApp
                </Button>
                <Button
                  variant="outline"
                  href="#webinar"
                  onClick={() => trackCtaClick("hero", "webinar")}
                  className="w-full sm:w-auto"
                >
                  Lihat Webinar
                </Button>
              </div>

              {stats.length > 0 && (
                <dl className="mt-10 flex flex-wrap items-center gap-6 md:gap-8">
                  {stats.map((stat, idx) => (
                    <Fragment key={stat.id}>
                      {idx > 0 && (
                        <div
                          className="h-11 w-[1.5px] bg-white/15"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <dt className="text-stat text-white">{stat.value}</dt>
                        <dd className="mt-1.5 max-w-[150px] text-meta font-medium text-stone-300">
                          {stat.label}
                        </dd>
                      </div>
                    </Fragment>
                  ))}
                </dl>
              )}
            </div>

            <HeroSlider slides={slides} />
          </div>
        </Container>
      </section>

      <PartnerStrip partners={partners} />
    </div>
  );
}
