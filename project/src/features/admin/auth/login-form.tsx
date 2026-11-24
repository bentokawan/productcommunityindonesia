"use client";

import { useState, useTransition } from "react";
import { loginWithPassword } from "@/features/admin/auth/actions";
import { adminFieldClass, adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

export interface LoginFormProps {
  next?: string;
  initialError?: string;
}

export function LoginForm({ next, initialError }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError ?? null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    setErrorMsg(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await loginWithPassword(formData);
      if (!res.ok) {
        setErrorMsg(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  return (
    <div className="space-y-5">
      {errorMsg && (
        <div
          role="alert"
          className="rounded-admin-textarea bg-admin-rose-soft px-4 py-3 admin-text-body text-admin-rose-ink"
        >
          {errorMsg}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block admin-text-label text-admin-ink"
          >
            Username <span className="text-admin-danger">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Masukkan username"
            aria-invalid={!!fieldErrors.username}
            className={adminFieldClass}
          />
          {fieldErrors.username && (
            <p
              role="alert"
              className="mt-1 admin-text-chip font-normal text-admin-danger"
            >
              {fieldErrors.username}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block admin-text-label text-admin-ink"
          >
            Password <span className="text-admin-danger">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Masukkan password"
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

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "mt-2 h-12 w-full cursor-pointer rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
            adminFocusRing,
          )}
        >
          {isPending ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
