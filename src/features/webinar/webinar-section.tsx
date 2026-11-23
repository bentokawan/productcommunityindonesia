"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
import { NextWebinarBanner } from "@/features/webinar/next-webinar-banner";
import { WebinarCard } from "@/features/webinar/webinar-card";
import { trackWebinarTab } from "@/lib/analytics";
import type {
  EventCategoryViewModel,
  WebinarCardData,
} from "@/lib/queries/mappers";

export interface WebinarSectionProps {
  categories: EventCategoryViewModel[];
  events: WebinarCardData[];
  next: WebinarCardData | null;
  instagramUrl: string;
  instagramHandle: string;
}

export function WebinarSection({
  categories,
  events,
  next,
  instagramUrl,
  instagramHandle,
}: WebinarSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const tabItems = useMemo(
    () => [
      { value: "all", label: "Semua" },
      ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    ],
    [categories],
  );

  const filteredEvents = useMemo(() => {
    if (activeCategory === "all") return events;
    return events.filter((event) => event.categorySlug === activeCategory);
  }, [events, activeCategory]);

  function handleCategoryChange(value: string) {
    setActiveCategory(value);
    trackWebinarTab(value);
  }

  return (
    <Section tone="dark" id="webinar">
      <Image
        src="/ornaments/webinar-circle.svg"
        alt=""
        width={440}
        height={440}
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-24 hidden select-none md:block"
      />

      <Container className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="WEBINAR & SHARING SESSION"
          title="Belajar langsung dari praktisi."
          description="Tiap sesi bareng praktisi product dari berbagai perusahaan. Santai, tapi tetap berbobot."
        />

        <div className="mt-8 md:mt-10">
          <Tabs
            items={tabItems}
            value={activeCategory}
            onValueChange={handleCategoryChange}
            ariaLabel="Kategori webinar"
          />
        </div>

        <div className="mt-8">
          <NextWebinarBanner
            next={next}
            instagramUrl={instagramUrl}
            instagramHandle={instagramHandle}
          />
        </div>

        {filteredEvents.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event, idx) => (
              <WebinarCard
                key={event.id}
                event={event}
                className={idx >= 3 ? "hidden md:flex" : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-body text-stone-300">
            Belum ada webinar di kategori ini.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Button variant="outline" href="/webinar">
            Lihat semua webinar
          </Button>
        </div>
      </Container>
    </Section>
  );
}
