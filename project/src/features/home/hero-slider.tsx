"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { Badge } from "@/components/ui/badge";
import type { SlideViewModel } from "@/lib/queries/mappers";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL_MS = 5000;

export interface HeroSliderProps {
  slides: SlideViewModel[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const reducedMotion = useReducedMotionSafe();
  const pointerStartX = useRef<number | null>(null);

  const count = slides.length;
  const isEffectivelyPaused = userPaused || isInteracting || reducedMotion;

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || isEffectivelyPaused) return;
    const timer = window.setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, isEffectivelyPaused, goNext]);

  if (count === 0) return null;

  const current = slides[index] ?? slides[0];
  if (!current) return null;

  const counterText = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri kegiatan Product Community Indonesia"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={() => setIsInteracting(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goPrev();
        }
      }}
      className="w-full select-none"
    >
      <div
        onPointerDown={(e) => {
          pointerStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (pointerStartX.current === null) return;
          const delta = e.clientX - pointerStartX.current;
          pointerStartX.current = null;
          if (Math.abs(delta) > 40) {
            if (delta < 0) goNext();
            else goPrev();
          }
        }}
        className="relative aspect-[350/240] w-full overflow-hidden rounded-xl border-[1.5px] border-white/12 bg-ink-800 shadow-(--shadow-float) md:aspect-[8/5] lg:aspect-auto lg:h-[clamp(380px,calc(100svh-200px),600px)]"
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            aria-hidden={idx !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-(--duration-base) ease-(--ease-out)",
              idx === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 767px) 92vw, (max-width: 1023px) 688px, (max-width: 1279px) 44vw, 540px"
              className="object-cover"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-900/75 via-ink-900/25 to-transparent" />

        <div className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-156px)] md:max-w-[calc(100%-240px)]">
          <Badge
            variant="caption"
            title={current.captionLong}
            className="max-w-full truncate"
          >
            <span className="md:hidden lg:inline">{current.caption}</span>
            <span className="hidden md:inline lg:hidden">
              {current.captionLong}
            </span>
          </Badge>
        </div>

        <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2">
          <span
            aria-live={isEffectivelyPaused ? "polite" : "off"}
            className="inline-flex h-10 items-center rounded-(--radius-control) bg-ink-900/90 px-3 text-mono text-white backdrop-blur-xs"
          >
            {counterText}
          </span>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label={
                  userPaused ? "Putar otomatis slide" : "Jeda slide otomatis"
                }
                onClick={() => setUserPaused((prev) => !prev)}
                className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--radius-control) bg-ink-900/90 text-white backdrop-blur-xs transition-colors hover:bg-ink-800 active:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) after:absolute after:-inset-0.5"
              >
                {userPaused ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  aria-label="Slide sebelumnya"
                  onClick={goPrev}
                  className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--radius-control) bg-ink-900/90 text-white backdrop-blur-xs transition-colors hover:bg-ink-800 active:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) after:absolute after:-inset-0.5"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Slide berikutnya"
                  onClick={goNext}
                  className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--radius-control) bg-brand-500 text-ink-900 transition-colors hover:bg-brand-500/90 active:bg-brand-500/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) after:absolute after:-inset-0.5"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {count > 1 && (
        <div
          className="mt-2 grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          }}
        >
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${idx + 1}: ${slide.caption}`}
              aria-current={idx === index ? "true" : undefined}
              onClick={() => setIndex(idx)}
              className="group/bar cursor-pointer py-[10.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
            >
              <span className="block h-[3px] w-full overflow-hidden rounded-[2px] bg-white/18">
                <span
                  className={cn(
                    "block h-full transition-colors duration-(--duration-base) ease-(--ease-out)",
                    idx === index
                      ? "bg-brand-500"
                      : "bg-transparent group-hover/bar:bg-white/40",
                  )}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
