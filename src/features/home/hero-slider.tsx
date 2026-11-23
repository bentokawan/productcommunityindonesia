"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SlideViewModel } from "@/lib/queries/mappers";

const AUTOPLAY_INTERVAL_MS = 5000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export interface HeroSliderProps {
  slides: SlideViewModel[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const pointerStartX = useRef<number | null>(null);

  const count = slides.length;

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || isPaused || reducedMotion) return;
    const timer = window.setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, isPaused, reducedMotion, goNext]);

  if (count === 0) return null;

  const current = slides[index] ?? slides[0];
  if (!current) return null;

  const counterText = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
  const progressPercent = ((index + 1) / count) * 100;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri kegiatan Product Community Indonesia"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goPrev();
        }
      }}
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
      className="relative w-full overflow-hidden rounded-xl border-[1.5px] border-white/12 bg-ink-800 shadow-(--shadow-float) select-none"
    >
      <div className="relative aspect-[350/240] w-full md:aspect-[8/5] xl:aspect-[9/10]">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            aria-hidden={idx !== index}
            className={`absolute inset-0 transition-opacity duration-(--duration-base) ease-(--ease-out) ${
              idx === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 767px) 92vw, (max-width: 1279px) 688px, 540px"
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute top-4 left-4 z-10">
          <Badge variant="caption">
            <span className="md:hidden xl:inline">{current.caption}</span>
            <span className="hidden md:inline xl:hidden">
              {current.captionLong}
            </span>
          </Badge>
        </div>

        <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2">
          <span
            aria-live="polite"
            className="inline-flex h-10 items-center rounded-full bg-ink-900/80 px-3.5 text-mono text-white backdrop-blur-xs"
          >
            {counterText}
          </span>

          {count > 1 && (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                aria-label="Slide sebelumnya"
                onClick={goPrev}
                className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ink-900/80 text-white backdrop-blur-xs transition-colors hover:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) after:absolute after:-inset-0.5"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Slide berikutnya"
                onClick={goNext}
                className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ink-900/80 text-white backdrop-blur-xs transition-colors hover:bg-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) after:absolute after:-inset-0.5"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-[3px] w-full bg-white/15" aria-hidden="true">
        <div
          className="h-full bg-brand-500 transition-[width] duration-(--duration-base) ease-(--ease-out)"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
