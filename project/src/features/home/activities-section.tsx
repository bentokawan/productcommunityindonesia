"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { MotionCard } from "@/components/motion/motion-card";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import type {
  ActivityViewModel,
  CommunityGroupViewModel,
} from "@/lib/queries/mappers";

export interface ActivitiesSectionProps {
  activities: ActivityViewModel[];
  groups: CommunityGroupViewModel[];
}

export function ActivitiesSection({
  activities,
  groups,
}: ActivitiesSectionProps) {
  return (
    <Section tone="muted" id="kegiatan">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="KEGIATAN"
          title={
            <>
              Yang bisa kamu ikutin <em>di PCI</em>
            </>
          }
          description="Bukan sekadar teori. Semua kegiatan di PCI dirancang buat ngehubungin ilmu dengan praktik di dunia kerja nyata."
        />

        {activities.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:grid-cols-2 md:gap-6 xl:mt-12 xl:grid-cols-4">
            {activities.map((activity, idx) => (
              <MotionCard key={activity.id} index={idx}>
                <Card tone="surface" className="h-full p-7">
                  <div
                    className="flex h-15 w-15 items-center justify-center rounded-md bg-brand-50 text-3xl leading-none"
                    aria-hidden="true"
                  >
                    {activity.emoji}
                  </div>
                  <h3 className="mt-5 text-title text-(--color-fg)">
                    {activity.title}
                  </h3>
                  <p className="mt-2 text-body text-(--color-fg-muted)">
                    {activity.description}
                  </p>
                </Card>
              </MotionCard>
            ))}
          </div>
        )}

        {groups.length > 0 && (
          <div className="mt-14 md:mt-16">
            <div className="mx-auto max-w-205 text-center">
              <h3 className="text-h4 text-(--color-fg)">
                Grup di dalam komunitas
              </h3>
              <p className="mt-2 text-lead text-(--color-fg-muted)">
                Setelah gabung, kamu bisa masuk ke grup-grup ini sesuai
                kebutuhan.
              </p>
            </div>

            <div className="mt-8 grid auto-rows-fr grid-cols-2 gap-3 md:gap-6 xl:grid-cols-4">
              {groups.map((group, idx) => (
                <MotionCard key={group.id} index={idx}>
                  <Card
                    tone="outlined"
                    className="flex h-full flex-col items-center gap-3 p-4.5 text-center md:flex-row md:items-center md:gap-4 md:text-left"
                  >
                    <Image
                      src={group.logoUrl}
                      alt={`Logo ${group.name}`}
                      width={72}
                      height={72}
                      className="h-18 w-18 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h4 className="text-lg leading-snug font-bold text-(--color-fg)">
                        {group.name}
                      </h4>
                      <p className="mt-1 text-small text-(--color-fg-muted)">
                        {group.description}
                      </p>
                    </div>
                  </Card>
                </MotionCard>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
