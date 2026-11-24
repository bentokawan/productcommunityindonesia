"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { resolveNavMeta } from "@/features/admin/shell/nav";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

export function PageHeader() {
  const pathname = usePathname();
  const meta = resolveNavMeta(pathname);
  const isAccountPage = pathname === "/admin/account";

  if (isAccountPage) {
    return (
      <div className="mb-7 flex items-start gap-4">
        <Link
          href="/admin"
          aria-label="Kembali ke Dashboard"
          title="Kembali ke Dashboard"
          className={cn(
            "mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface active:scale-95",
            adminFocusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="space-y-1.5">
          <h1 className="admin-text-page-title text-admin-ink">{meta.title}</h1>
          {meta.description && (
            <p className="admin-text-nav leading-normal text-admin-text-secondary">
              {meta.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-7 space-y-2">
      {meta.groupLabel && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 admin-text-meta text-admin-text-secondary"
        >
          <span>{meta.groupLabel}</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-admin-ink">{meta.title}</span>
        </nav>
      )}
      <h1 className="admin-text-page-title text-admin-ink">{meta.title}</h1>
      {meta.description && (
        <p className="admin-text-nav leading-normal text-admin-text-secondary">
          {meta.description}
        </p>
      )}
    </div>
  );
}
