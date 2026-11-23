import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  createHref: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  createHref,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pillBase =
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-[1.5px] px-4 py-2 text-[16px] leading-none font-bold transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)";

  return (
    <nav
      aria-label="Navigasi halaman"
      className={cn("flex flex-wrap items-center justify-center gap-3", className)}
    >
      {currentPage > 1 && (
        <Link
          href={createHref(currentPage - 1)}
          aria-label="Halaman sebelumnya"
          className={cn(pillBase, "border-white/22 text-white hover:bg-white/8")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}

      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <Link
            key={page}
            href={createHref(page)}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              pillBase,
              isCurrent
                ? "border-brand-500 bg-brand-500 text-ink-900"
                : "border-white/22 text-white hover:bg-white/8",
            )}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={createHref(currentPage + 1)}
          aria-label="Halaman berikutnya"
          className={cn(pillBase, "border-white/22 text-white hover:bg-white/8")}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
