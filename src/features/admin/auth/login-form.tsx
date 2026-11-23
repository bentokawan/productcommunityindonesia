"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { loginWithPassword } from "@/features/admin/auth/actions";
import { GoogleButton } from "@/features/admin/auth/google-button";

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
    <div className="space-y-6">
      {errorMsg && (
        <div
          role="alert"
          className="rounded-2xl bg-admin-rose-soft px-4 py-3 text-[14px] text-admin-rose-ink"
        >
          {errorMsg}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

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
          {fieldErrors.email && (
            <p className="mt-1 text-[12px] text-admin-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[13px] font-medium text-admin-ink"
            >
              Password <span className="text-admin-danger">*</span>
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-[13px] text-admin-text-secondary hover:text-admin-ink hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Masukkan password"
            className="h-12 w-full rounded-full border border-admin-line bg-admin-surface px-4.5 text-[16px] text-admin-ink placeholder:text-admin-text-faint focus:border-admin-ink focus:bg-admin-canvas focus:outline-none md:text-[14px]"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-[12px] text-admin-danger">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-full bg-admin-ink px-6 text-[15px] font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-ink disabled:opacity-50"
        >
          {isPending ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-admin-line" />
        <span className="bg-admin-canvas px-3 text-[12px] text-admin-text-secondary">
          atau
        </span>
      </div>

      <GoogleButton next={next} />
    </div>
  );
}
