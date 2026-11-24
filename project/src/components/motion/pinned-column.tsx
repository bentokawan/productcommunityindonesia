"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";

gsap.registerPlugin(ScrollTrigger);

export interface PinnedColumnProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
}

export function PinnedColumn({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
}: PinnedColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const container = containerRef.current;
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    if (!container || !leftEl || !rightEl || reducedMotion) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1280px)", () => {
      if (rightEl.offsetHeight <= leftEl.offsetHeight + 80) return;

      ScrollTrigger.create({
        trigger: container,
        start: "top 88px",
        end: () =>
          `bottom bottom-=${Math.max(0, (container.offsetHeight - leftEl.offsetHeight) * 0.04)}`,
        pin: leftEl,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    });

    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    ro.observe(rightEl);

    return () => {
      ro.disconnect();
      mm.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      <div ref={leftRef} className={leftClassName}>
        {left}
      </div>
      <div ref={rightRef} className={rightClassName}>
        {right}
      </div>
    </div>
  );
}
