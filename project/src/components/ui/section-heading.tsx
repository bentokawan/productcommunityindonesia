import type { ReactNode } from "react";
import { SplitWordsHeading } from "@/components/motion/split-words-heading";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  headingMode?: "mount" | "scroll";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  headingMode = "scroll",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-[820px] text-center" : "text-left",
        className,
      )}
    >
      <p className="text-eyebrow text-(--color-accent)">{eyebrow}</p>
      <SplitWordsHeading
        as={Heading}
        mode={headingMode}
        className="mt-2 text-h2 heading-em text-(--color-fg) md:mt-3"
      >
        {title}
      </SplitWordsHeading>
      {description && (
        <p className="mt-3 text-lead text-(--color-fg-muted) md:mt-4">
          {description}
        </p>
      )}
    </div>
  );
}
