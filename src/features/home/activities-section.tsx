import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
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
          title="Yang bisa kamu ikutin di PCI"
          description="Bukan sekadar teori. Semua kegiatan di PCI dirancang buat ngehubungin ilmu dengan praktik di dunia kerja nyata."
        />

        {activities.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:grid-cols-2 md:gap-6 xl:mt-12 xl:grid-cols-4">
            {activities.map((activity) => (
              <Card key={activity.id} tone="surface" className="p-7">
                <div
                  className="flex h-15 w-15 items-center justify-center rounded-md bg-brand-50 text-[28px]"
                  aria-hidden="true"
                >
                  {activity.emoji}
                </div>
                <h3 className="mt-5 text-title text-ink-900">
                  {activity.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.5] text-stone-500">
                  {activity.description}
                </p>
              </Card>
            ))}
          </div>
        )}

        {groups.length > 0 && (
          <div className="mt-14 md:mt-16">
            <div className="text-center">
              <h3 className="text-h4 text-ink-900">Grup di dalam komunitas</h3>
              <p className="mt-2 text-lead text-stone-500">
                Setelah gabung, kamu bisa masuk ke grup-grup ini sesuai
                kebutuhan.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-4">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  tone="outlined"
                  className="flex flex-col items-center gap-3 p-[18.5px] text-center md:flex-row md:items-center md:gap-4 md:text-left"
                >
                  <Image
                    src={group.logoUrl}
                    alt={`Logo ${group.name}`}
                    width={72}
                    height={72}
                    className="h-18 w-18 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h4 className="text-[18px] leading-[1.25] font-bold text-ink-900">
                      {group.name}
                    </h4>
                    <p className="mt-1 text-small text-stone-500">
                      {group.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
