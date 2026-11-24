import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "navbar" | "footer";
  className?: string;
}

export function Logo({ variant = "navbar", className }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <span
      className={cn(
        "inline-flex items-center text-white select-none",
        isFooter ? "h-10 gap-3 md:h-12 md:gap-3.5" : "h-8 gap-2.5 lg:h-10 lg:gap-3",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center",
          isFooter ? "gap-1.5" : "gap-1",
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            "inline-flex items-center border-[2px] border-white rounded-l-full rounded-r-[1.5px] pl-2",
            isFooter
              ? "h-[19px] w-[70px] gap-[2.5px] md:h-[22px] md:w-[82px]"
              : "h-[15px] w-[54px] gap-[2px] lg:h-[18px] lg:w-[69px] lg:gap-[2.2px]",
          )}
        >
          <span
            className={cn(
              "rounded-[1px] bg-white",
              isFooter ? "h-2.5 w-[2.2px]" : "h-2 w-[1.8px] lg:h-2.5 lg:w-[2.2px]",
            )}
          />
          <span
            className={cn(
              "rounded-[1px] bg-white",
              isFooter ? "h-2.5 w-[2.2px]" : "h-2 w-[1.8px] lg:h-2.5 lg:w-[2.2px]",
            )}
          />
          <span
            className={cn(
              "rounded-[1px] bg-white",
              isFooter ? "h-2.5 w-[2.2px]" : "h-2 w-[1.8px] lg:h-2.5 lg:w-[2.2px]",
            )}
          />
          <span
            className={cn(
              "rounded-[1px] bg-white",
              isFooter ? "h-2.5 w-[2.2px]" : "h-2 w-[1.8px] lg:h-2.5 lg:w-[2.2px]",
            )}
          />
          <span
            className={cn(
              "rounded-[1px] bg-white",
              isFooter ? "h-2.5 w-[2.2px]" : "h-2 w-[1.8px] lg:h-2.5 lg:w-[2.2px]",
            )}
          />
        </span>
        <Image
          src="/images/hero/logo-bulb.svg"
          alt=""
          width={27}
          height={28}
          className={cn(
            "w-auto shrink-0",
            isFooter ? "h-7 md:h-8" : "h-[22px] lg:h-7",
          )}
        />
      </span>

      <span
        className={cn(
          "flex flex-col leading-[1.16] tracking-[-0.005em] font-bold text-white",
          isFooter ? "text-[16px] md:text-[20px]" : "text-[13.5px] lg:text-[17px]",
        )}
      >
        <span>Product Community</span>
        <span>Indonesia.</span>
      </span>
    </span>
  );
}
