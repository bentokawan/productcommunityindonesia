import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("", {
  variants: {
    tone: {
      surface: "rounded-xl bg-(--color-surface)",
      outlined:
        "rounded-lg border-[1.5px] border-(--color-border) bg-(--color-surface)",
      inverse: "rounded-xl bg-ink-900 p-7 text-white md:p-10",
      muted: "rounded-lg bg-stone-100 text-(--color-fg)",
    },
  },
  defaultVariants: {
    tone: "surface",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ tone, className, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ tone }), className)} {...props} />
  );
}
