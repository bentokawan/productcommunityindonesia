"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface MotionCardProps {
  as?: "div" | "article" | "li";
  index?: number;
  interactive?: boolean;
  hoverLift?: number;
  className?: string;
  children: ReactNode;
}

export function MotionCard({
  as = "div",
  index = 0,
  interactive = false,
  hoverLift = -5,
  className,
  children,
}: MotionCardProps) {
  const prefersReduced = useReducedMotion();
  const Component =
    as === "article"
      ? motion.article
      : as === "li"
        ? motion.li
        : motion.div;

  return (
    <Component
      initial={prefersReduced ? false : { y: 20, scale: 0.985 }}
      whileInView={prefersReduced ? undefined : { y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 28,
        delay: Math.min(index * 0.055, 0.22),
      }}
      whileHover={
        !interactive || prefersReduced
          ? undefined
          : {
              y: hoverLift,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
      }
      whileTap={!interactive || prefersReduced ? undefined : { scale: 0.99 }}
      className={className}
    >
      {children}
    </Component>
  );
}
