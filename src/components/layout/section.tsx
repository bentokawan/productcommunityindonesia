import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "light" | "muted" | "dark";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  flush?: boolean;
}

export function Section({
  tone = "light",
  flush = false,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "relative overflow-x-clip bg-(--color-bg) text-(--color-fg) scroll-mt-6",
        !flush && "py-18 md:py-24 xl:py-30",
        className,
      )}
      {...props}
    />
  );
}
