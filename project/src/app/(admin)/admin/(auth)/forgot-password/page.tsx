"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/features/admin/auth/actions";
import { adminFieldClass, adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await requestPasswordReset(formData);
      if (res.ok) {
        setSent(true);
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <div>
      <h1 className="text-center admin-text-page-title font-medium text-admin-ink">
        Lupa password
      </h1>
      <p className="mt-2.5 text-center admin-text-body text-admin-text-secondary">
        Masukkan email yang terdaftar di CMS. Kami akan kirim link untuk atur
        ulang password.
      </p>

      {sent ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-admin-textarea bg-admin-mint-soft p-4 admin-text-body text-admin-mint-ink">
            Jika email tersebut terdaftar di CMS, link atur ulang password sudah
            kami kirim ke kotak masukmu.
          </div>
          <Link
            href="/admin/login"
            className={cn(
              "inline-flex h-12 w-full items-center justify-center rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90",
              adminFocusRing,
            )}
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      ) : (
        <form action={handleSubmit} className="mt-6 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-admin-textarea bg-admin-rose-soft px-4 py-3 admin-text-body text-admin-rose-ink"
            >
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block admin-text-label text-admin-ink"
            >
              Email <span className="text-admin-danger">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nama@domain.com"
              className={adminFieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "h-12 w-full cursor-pointer rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
              adminFocusRing,
            )}
          >
            {isPending ? "Mengirim…" : "Kirim link reset"}
          </button>

          <div className="text-center">
            <Link
              href="/admin/login"
              className={cn(
                "rounded-sm admin-text-label font-normal text-admin-text-secondary hover:text-admin-ink hover:underline",
                adminFocusRing,
              )}
            >
              Kembali ke masuk
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
