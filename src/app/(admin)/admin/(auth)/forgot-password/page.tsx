"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/features/admin/auth/actions";

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
      <h1 className="text-[28px] leading-[1.15] font-normal tracking-[-0.02em] text-admin-ink">
        Lupa password
      </h1>
      <p className="mt-2 text-[14px] text-admin-text-secondary">
        Masukkan email yang terdaftar di CMS. Kami akan kirim link untuk atur
        ulang password.
      </p>

      {sent ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl bg-admin-mint-soft p-4 text-[14px] text-admin-mint-ink">
            Jika email tersebut terdaftar di CMS, link atur ulang password sudah
            kami kirim ke kotak masukmu.
          </div>
          <Link
            href="/admin/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-admin-ink px-6 text-[15px] font-medium text-admin-on-ink"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      ) : (
        <form action={handleSubmit} className="mt-6 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-2xl bg-admin-rose-soft px-4 py-3 text-[14px] text-admin-rose-ink"
            >
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[13px] font-medium text-admin-ink"
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
              className="h-12 w-full rounded-full border border-admin-line bg-admin-surface px-4.5 text-[16px] text-admin-ink placeholder:text-admin-text-faint focus:border-admin-ink focus:bg-admin-canvas focus:outline-none md:text-[14px]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full cursor-pointer rounded-full bg-admin-ink px-6 text-[15px] font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft disabled:opacity-50"
          >
            {isPending ? "Mengirim…" : "Kirim link reset"}
          </button>

          <div className="text-center">
            <Link
              href="/admin/login"
              className="text-[13px] text-admin-text-secondary hover:text-admin-ink hover:underline"
            >
              Kembali ke masuk
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
