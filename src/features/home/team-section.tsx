import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { TeamMemberViewModel } from "@/lib/queries/mappers";

export interface TeamSectionProps {
  members: TeamMemberViewModel[];
}

export function TeamSection({ members }: TeamSectionProps) {
  if (members.length === 0) return null;

  return (
    <Section tone="light" id="pengurus">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="PENGURUS"
          title="Dibangun oleh product people"
          description="Komunitas ini dibangun oleh para praktisi produk yang ingin menciptakan dampak nyata bagi ekosistem digital Indonesia."
        />

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:gap-6 xl:mt-12 xl:grid-cols-4">
          {members.map((member) => (
            <article key={member.id} className="flex flex-col">
              <div className="relative aspect-[282/310] w-full overflow-hidden rounded-lg bg-stone-100">
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  sizes="(max-width: 767px) 46vw, (max-width: 1279px) 44vw, 282px"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-title text-ink-900">{member.name}</h3>
              <p className="mt-1 text-[16px] text-stone-500">{member.role}</p>
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 inline-flex min-h-[44px] w-fit items-center gap-1 text-meta font-bold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              )}
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
