"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trackWebinarIgClick } from "@/lib/analytics";
import type { WebinarCardData } from "@/lib/queries/mappers";
import { cn } from "@/lib/utils";

export interface WebinarCardProps {
  event: WebinarCardData;
  headingAs?: "h2" | "h3";
  index?: number;
  className?: string;
}

export function WebinarCard({
  event,
  headingAs: Heading = "h3",
  index = 0,
  className,
}: WebinarCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.a
      href={event.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWebinarIgClick(event.slug)}
      initial={prefersReduced ? false : { y: 22, scale: 0.985 }}
      whileInView={prefersReduced ? undefined : { y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 28,
        delay: Math.min((index % 3) * 0.06, 0.18),
      }}
      whileHover={
        prefersReduced
          ? undefined
          : {
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
      }
      whileTap={prefersReduced ? undefined : { scale: 0.99 }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-[1.5px] border-(--color-border) bg-(--color-surface) transition-colors duration-(--duration-fast) hover:border-(--color-outline-subtle) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ink-900">
        <Image
          src={event.posterUrl}
          alt=""
          fill
          sizes="(max-width: 767px) 92vw, (max-width: 1279px) 44vw, 384px"
          className="object-cover transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5.5">
        <div>
          <Badge variant="chip">{event.editionLabel}</Badge>
          <Heading className="mt-3 line-clamp-3 text-title text-(--color-fg)">
            {event.title}
          </Heading>
          <p className="mt-2 text-meta text-(--color-fg-muted)">
            {event.speakers}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <div className="border-t border-(--color-divider) pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-meta font-medium text-(--color-fg-muted)">
                <span aria-hidden="true">📅</span> {event.formattedDate}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-meta font-bold text-(--color-accent)">
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
    </motion.a>
  );
}
