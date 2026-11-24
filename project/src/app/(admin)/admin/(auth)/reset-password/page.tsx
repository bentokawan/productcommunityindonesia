"use client";

import { useState, useTransition } from "react";
import { updatePasswordFromReset } from "@/features/admin/auth/actions";
import { adminFieldClass, adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

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
      <h1 className="text-center admin-text-page-title font-medium text-admin-ink">
        Atur password baru
      </h1>
      <p className="mt-2.5 text-center admin-text-body text-admin-text-secondary">
        Gunakan minimal 10 karakter agar akun CMS tetap aman.
      </p>

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
            htmlFor="password"
            className="mb-1.5 block admin-text-label text-admin-ink"
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
            aria-invalid={!!fieldErrors.password}
            className={adminFieldClass}
          />
          {fieldErrors.password && (
            <p
              role="alert"
              className="mt-1 admin-text-chip font-normal text-admin-danger"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block admin-text-label text-admin-ink"
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
            aria-invalid={!!fieldErrors.confirmPassword}
            className={adminFieldClass}
          />
          {fieldErrors.confirmPassword && (
            <p
              role="alert"
              className="mt-1 admin-text-chip font-normal text-admin-danger"
            >
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "h-12 w-full cursor-pointer rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
            adminFocusRing,
          )}
        >
          {isPending ? "Menyimpan…" : "Simpan password"}
        </button>
      </form>
    </div>
  );
}
