import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-2 font-semibold", {
  variants: {
    variant: {
      pill: "rounded-full border-[1.5px] border-white/22 px-4 py-2 text-body-sm font-semibold text-white/90",
      chip: "rounded-xs bg-brand-500/14 px-2.5 py-1 text-chip text-brand-500",
      status:
        "rounded-sm bg-brand-500/15 px-3 py-1.5 text-chip tracking-[0.12em] uppercase text-brand-500",
      caption:
        "rounded-full bg-white px-3.5 py-1.5 text-mono text-[11px] font-normal text-ink-900",
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
