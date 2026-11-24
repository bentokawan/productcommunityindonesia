"use client";

import Link from "next/link";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-admin-card border border-admin-line bg-admin-canvas p-8 text-center">
      <h2 className="admin-text-modal-title font-medium text-admin-ink">
        Gagal memuat halaman CMS
      </h2>
      <p className="mt-2 admin-text-body text-admin-text-secondary">
        Terjadi kendala saat mengambil data. Coba muat ulang halaman ini.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={cn(
            "h-11 cursor-pointer rounded-full bg-admin-ink px-5 admin-text-body font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90",
            adminFocusRing,
          )}
        >
          Coba lagi
        </button>
        <Link
          href="/admin"
          className={cn(
            "inline-flex h-11 items-center rounded-full border border-admin-line px-5 admin-text-body font-medium text-admin-ink transition-colors hover:bg-admin-surface active:bg-admin-surface-muted",
            adminFocusRing,
          )}
        >
          Ke Dashboard
        </Link>
      </div>
    </div>
  );
}
