import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "navbar" | "footer";
  className?: string;
}

export function Logo({ variant = "navbar", className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-white select-none",
        variant === "navbar"
          ? "h-8 w-[225px] lg:h-10 lg:w-[281px]"
          : "h-10 w-[280px] md:h-12 md:w-[337px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="12" fill="#02D6A6" />
        <path
          d="M13 28V12H20.5C24.09 12 27 14.91 27 18.5C27 22.09 24.09 25 20.5 25H17V28H13ZM17 21H20.25C21.77 21 23 19.88 23 18.5C23 17.12 21.77 16 20.25 16H17V21Z"
          fill="#1A1A19"
        />
      </svg>
      <span className="flex flex-col leading-[1.08] tracking-[-0.02em]">
        <span
          className={cn(
            "font-bold text-white",
            variant === "navbar"
              ? "text-[14px] lg:text-[17px]"
              : "text-[17px] md:text-[20px]",
          )}
        >
          product community{" "}
        </span>
        <span
          className={cn(
            "font-medium text-brand-500",
            variant === "navbar"
              ? "text-[12px] lg:text-[14px]"
              : "text-[14px] md:text-[16px]",
          )}
        >
          indonesia
        </span>
      </span>
    </span>
  );
}
