"use client";

import Image from "next/image";
import { Fragment } from "react";
import { Container } from "@/components/layout/container";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SplitWordsHeading } from "@/components/motion/split-words-heading";
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
      {/* Decorative hero ornaments positioned per Figma artboard coordinates */}
      <Image
        src="/ornaments/hero-circle-main.svg"
        alt=""
        width={1296}
        height={1296}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[360px] left-[45%] hidden select-none lg:block"
      />
      <Image
        src="/ornaments/hero-ornament-left.svg"
        alt=""
        width={100}
        height={100}
        aria-hidden="true"
        className="pointer-events-none absolute top-[420px] -left-[50px] hidden select-none xl:block"
      />
      <Image
        src="/ornaments/hero-ornament-right.png"
        alt=""
        width={100}
        height={100}
        aria-hidden="true"
        className="pointer-events-none absolute top-[260px] -right-[50px] hidden select-none xl:block"
      />

      <div className="relative z-10 flex flex-col lg:min-h-[100svh] lg:justify-between">
        <SiteNavbar
          whatsappUrl={links.whatsappUrl}
          instagramUrl={links.instagramUrl}
        />

        <section className="flex flex-1 items-center pt-6 pb-8 md:pt-8 md:pb-10 lg:py-4 xl:py-6">
          <Container>
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-8 xl:grid-cols-[600px_540px] xl:justify-between xl:gap-10">
              <div>
                <Badge variant="pill">
                  <span aria-hidden="true">💡</span>
                  <span>Step by step, sampai idenya nyala</span>
                </Badge>

                <SplitWordsHeading
                  as="h1"
                  mode="mount"
                  className="mt-4 max-w-150 text-display heading-em text-(--color-fg) xl:mt-5"
                >
                  Belajar &amp; Bertumbuh Bersama{" "}
                  <em>Komunitas Product Indonesia</em>
                </SplitWordsHeading>

                <p className="mt-3.5 max-w-135 text-lead text-(--color-fg-muted) xl:mt-4">
                  Dari diskusi hingga kolaborasi nyata, kami hadir untuk
                  mendukung perjalananmu menjadi praktisi produk yang adaptif dan
                  relevan di industri digital.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 xl:mt-7">
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
                  <dl className="mt-6 flex flex-wrap items-center gap-6 md:gap-8 xl:mt-8">
                    {stats.map((stat, idx) => (
                      <Fragment key={stat.id}>
                        {idx > 0 && (
                          <div
                            className="h-11 w-[1.5px] bg-white/15"
                            aria-hidden="true"
                          />
                        )}
                        <div>
                          <dt className="text-stat text-(--color-fg)">
                            {stat.value}
                          </dt>
                          <dd className="mt-1.5 max-w-37.5 text-meta font-medium text-(--color-fg-muted)">
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
      </div>

      <div className="relative z-10">
        <PartnerStrip partners={partners} />
      </div>
    </div>
  );
}
