import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ABOUT_CONTENT } from "@/content/about";

export function AboutSection() {
  return (
    <Section tone="light" id="tentang">
      <Container>
        <div className="grid gap-10 xl:grid-cols-[520px_600px] xl:items-start xl:justify-between">
          <div>
            <SectionHeading
              align="left"
              eyebrow={ABOUT_CONTENT.eyebrow}
              title={
                <>
                  Dari product people, <em>untuk product people.</em>
                </>
              }
            />
            <p className="mt-5 text-lead text-stone-500">
              {ABOUT_CONTENT.description}
            </p>
          </div>

          <div className="space-y-8">
            <Card tone="inverse">
              <p className="text-eyebrow text-brand-500">
                {ABOUT_CONTENT.visionEyebrow}
              </p>
              <p className="mt-3 text-quote text-white">
                {ABOUT_CONTENT.vision}
              </p>
            </Card>

            <div>
              <p className="text-eyebrow text-brand-700">
                {ABOUT_CONTENT.missionEyebrow}
              </p>
              <ol className="mt-5 space-y-4">
                {ABOUT_CONTENT.missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[15px] font-bold text-brand-700"
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 text-body text-ink-900">
                      {mission}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
