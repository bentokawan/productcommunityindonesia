import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
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
        <div className="grid gap-8 md:gap-10 xl:grid-cols-[400px_1fr] xl:items-start xl:gap-16">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Yang sering ditanyain"
            description="Masih ada pertanyaan lain? Tanya langsung aja di grup komunitas."
          />

          <Accordion items={faqs} defaultOpenAll />
        </div>
      </Container>
    </Section>
  );
}
