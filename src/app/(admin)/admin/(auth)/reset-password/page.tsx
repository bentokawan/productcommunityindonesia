"use client";

import { useState, useTransition } from "react";
import { updatePasswordFromReset } from "@/features/admin/auth/actions";

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    setErrorMsg(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await updatePasswordFromReset(formData);
      if (!res.ok) {
        setErrorMsg(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  return (
    <div>
      <h1 className="text-[28px] leading-[1.15] font-normal tracking-[-0.02em] text-admin-ink">
        Atur password baru
      </h1>
      <p className="mt-2 text-[14px] text-admin-text-secondary">
        Gunakan minimal 10 karakter agar akun CMS tetap aman.
      </p>

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
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-medium text-admin-ink"
          >
            Password baru <span className="text-admin-danger">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            placeholder="Minimal 10 karakter"
            className="h-12 w-full rounded-full border border-admin-line bg-admin-surface px-4.5 text-[16px] text-admin-ink placeholder:text-admin-text-faint focus:border-admin-ink focus:bg-admin-canvas focus:outline-none md:text-[14px]"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-[12px] text-admin-danger">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-[13px] font-medium text-admin-ink"
          >
            Ulangi password <span className="text-admin-danger">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            placeholder="Ketik ulang password"
            className="h-12 w-full rounded-full border border-admin-line bg-admin-surface px-4.5 text-[16px] text-admin-ink placeholder:text-admin-text-faint focus:border-admin-ink focus:bg-admin-canvas focus:outline-none md:text-[14px]"
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-[12px] text-admin-danger">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-full bg-admin-ink px-6 text-[15px] font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft disabled:opacity-50"
        >
          {isPending ? "Menyimpan…" : "Simpan password"}
        </button>
      </form>
    </div>
  );
}
