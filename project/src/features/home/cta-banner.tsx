"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { MotionCard } from "@/components/motion/motion-card";
import { SplitWordsHeading } from "@/components/motion/split-words-heading";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";

export interface CtaBannerProps {
  whatsappUrl: string;
  instagramUrl: string;
}

export function CtaBanner({ whatsappUrl, instagramUrl }: CtaBannerProps) {
  return (
    <Section tone="light" flush className="py-6 md:py-10">
      <Container>
        <MotionCard index={0}>
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-7 md:p-12 xl:p-15">
            <Image
              src="/ornaments/cta-circles.svg"
              alt=""
              width={420}
              height={340}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 hidden h-full w-auto select-none md:block"
            />

            <div className="relative z-10">
              <SplitWordsHeading
                as="h2"
                mode="scroll"
                className="max-w-215 text-h3 text-ink-900"
              >
                Yuk, mulai dari gabung komunitasnya dulu.
              </SplitWordsHeading>
              <p className="mt-4 max-w-180 text-lead text-ink-900/80">
                Terbuka buat siapa aja yang tertarik sama dunia product. Kenalan,
                tanya-tanya, dan tumbuh bareng step by step.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  variant="dark"
                  external
                  href={whatsappUrl}
                  onClick={() => trackCtaClick("cta", "whatsapp")}
                  className="w-full sm:w-auto"
                >
                  Gabung Grup WhatsApp
                </Button>
                <Button
                  variant="outline"
                  external
                  href={instagramUrl}
                  onClick={() => trackCtaClick("cta", "instagram")}
                  className="w-full border-ink-900 text-ink-900 hover:bg-ink-900/5 sm:w-auto"
                >
                  Follow Instagram
                </Button>
              </div>
            </div>
          </div>
        </MotionCard>
      </Container>
    </Section>
  );
}
