"use client";

import Link from "next/link";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-[32px] border border-admin-line bg-admin-canvas p-8 text-center">
      <h2 className="text-[20px] font-medium text-admin-ink">
        Gagal memuat halaman CMS
      </h2>
      <p className="mt-2 text-[14px] text-admin-text-secondary">
        Terjadi kendala saat mengambil data. Coba muat ulang halaman ini.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-11 cursor-pointer rounded-full bg-admin-ink px-5 text-[14px] font-medium text-admin-on-ink"
        >
          Coba lagi
        </button>
        <Link
          href="/admin"
          className="inline-flex h-11 items-center rounded-full border border-admin-line px-5 text-[14px] font-medium text-admin-ink"
        >
          Ke Dashboard
        </Link>
      </div>
    </div>
  );
}
