"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { resolveNavMeta } from "@/features/admin/shell/nav";

export function PageHeader() {
  const pathname = usePathname();
  const meta = resolveNavMeta(pathname);

  return (
    <div className="mb-7 space-y-2">
      {meta.groupLabel && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[14px] text-admin-text-secondary"
        >
          <span>{meta.groupLabel}</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-admin-ink">{meta.title}</span>
        </nav>
      )}
      <h1 className="text-[24px] leading-[1.1] font-normal tracking-[-0.02em] text-admin-ink sm:text-[28px] md:text-[40px]">
        {meta.title}
      </h1>
      {meta.description && (
        <p className="text-[15px] text-admin-text-secondary">
          {meta.description}
        </p>
      )}
    </div>
  );
}
