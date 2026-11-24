import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-2 font-semibold", {
  variants: {
    variant: {
      pill: "rounded-full border-[1.5px] border-(--color-outline-subtle) px-4 py-2 text-body font-semibold text-(--color-fg)/90",
      chip: "rounded-xs bg-brand-500/14 px-2.5 py-1 text-chip text-brand-500",
      status:
        "rounded-sm bg-brand-500/15 px-3 py-1.5 text-chip tracking-[0.12em] uppercase text-brand-500",
      caption:
        "rounded-sm bg-white px-2.5 py-1.5 text-mono font-normal text-ink-900",
    },
  },
  defaultVariants: {
    variant: "pill",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
