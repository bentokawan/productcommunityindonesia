"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PinnedColumn } from "@/components/motion/pinned-column";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { FaqViewModel } from "@/lib/queries/mappers";

export interface FaqSectionProps {
  faqs: FaqViewModel[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <Section tone="light" id="faq">
      <Container>
        <PinnedColumn
          className="grid gap-8 md:gap-10 xl:grid-cols-[400px_1fr] xl:items-start xl:gap-16"
          left={
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Yang sering ditanyain"
              description="Masih ada pertanyaan lain? Tanya langsung aja di grup komunitas."
            />
          }
          right={<Accordion items={faqs} defaultOpenAll />}
        />
      </Container>
    </Section>
  );
}
