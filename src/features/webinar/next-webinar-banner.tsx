"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackCtaClick, trackWebinarIgClick } from "@/lib/analytics";
import type { WebinarCardData } from "@/lib/queries/mappers";

export interface NextWebinarBannerProps {
  next: WebinarCardData | null;
  instagramUrl: string;
  instagramHandle: string;
}

export function NextWebinarBanner({
  next,
  instagramUrl,
  instagramHandle,
}: NextWebinarBannerProps) {
  return (
    <div className="rounded-xl border-[1.5px] border-brand-500/50 bg-ink-800 p-6 md:p-[34px]">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <Badge variant="status">WEBINAR BERIKUTNYA</Badge>
          {next ? (
            <>
              <h3 className="mt-4 text-h4 text-white">{next.title}</h3>
              <p className="mt-2 max-w-[700px] text-[16px] leading-[1.5] text-stone-300">
                <span aria-hidden="true">📅</span> {next.formattedDate} ·{" "}
                {next.speakers}
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-h4 text-white">
                Lagi disiapin, pantengin terus ya!
              </h3>
              <p className="mt-2 max-w-[700px] text-[16px] leading-[1.5] text-stone-300">
                Info webinar terbaru selalu diumumin duluan di grup WhatsApp dan
                Instagram {instagramHandle}.
              </p>
            </>
          )}
        </div>

        <div className="shrink-0">
          {next ? (
            <Button
              variant="outline"
              external
              href={next.instagramUrl}
              onClick={() => trackWebinarIgClick(next.slug)}
              className="w-full lg:w-auto"
            >
              Lihat di IG
            </Button>
          ) : (
            <Button
              variant="outline"
              external
              href={instagramUrl}
              onClick={() => trackCtaClick("webinar_banner", "instagram")}
              className="w-full lg:w-auto"
            >
              Follow Instagram
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
