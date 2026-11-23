"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trackWebinarIgClick } from "@/lib/analytics";
import type { WebinarCardData } from "@/lib/queries/mappers";
import { cn } from "@/lib/utils";

export interface WebinarCardProps {
  event: WebinarCardData;
  headingAs?: "h2" | "h3";
  className?: string;
}

export function WebinarCard({
  event,
  headingAs: Heading = "h3",
  className,
}: WebinarCardProps) {
  return (
    <a
      href={event.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWebinarIgClick(event.slug)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-[1.5px] border-white/8 bg-ink-800 transition-colors duration-(--duration-fast) hover:border-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ink-900">
        <Image
          src={event.posterUrl}
          alt={event.title}
          fill
          sizes="(max-width: 767px) 92vw, (max-width: 1279px) 44vw, 384px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-[22.5px]">
        <div>
          <Badge variant="chip">{event.editionLabel}</Badge>
          <Heading className="mt-3 line-clamp-3 text-title text-white">
            {event.title}
          </Heading>
          <p className="mt-2 text-meta text-stone-300">{event.speakers}</p>
        </div>

        <div className="mt-auto pt-4">
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-meta font-medium text-stone-300">
                <span aria-hidden="true">📅</span> {event.formattedDate}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-meta font-bold text-brand-500">
                <span>Lihat di IG</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
