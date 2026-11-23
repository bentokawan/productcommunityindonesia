import { Container } from "@/components/layout/container";
import type { PartnerViewModel } from "@/lib/queries/mappers";

export interface PartnerStripProps {
  partners: PartnerViewModel[];
}

export function PartnerStrip({ partners }: PartnerStripProps) {
  if (partners.length === 0) return null;

  return (
    <div className="border-t border-white/10 py-8 md:py-9">
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-[15px] font-semibold tracking-[0.06em] text-stone-300">
            Pernah berkolaborasi bareng
          </p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 xl:gap-x-10">
            {partners.map((partner) => (
              <li
                key={partner.id}
                className="text-[18px] font-bold text-white/55 md:text-[20px]"
              >
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    {partner.name}
                  </a>
                ) : (
                  partner.name
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
