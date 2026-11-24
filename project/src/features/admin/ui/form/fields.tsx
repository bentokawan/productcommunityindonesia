import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminFocusRing } from "@/features/admin/ui/form/controls";

export interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block admin-text-label text-admin-ink">
        {label}
        {required && <span className="ml-1 text-admin-danger">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="admin-text-chip font-normal text-admin-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="admin-text-chip font-normal text-admin-text-secondary">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FieldGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {children}
    </div>
  );
}

export function FormSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 border-b border-admin-line pb-7 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-admin-ink admin-text-chip font-bold text-admin-on-ink">
          {step}
        </span>
        <h2 className="admin-text-section-label text-admin-ink">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function FormPage({
  backHref,
  title,
  subtitle,
  width = "single",
  errorMessage,
  isPending,
  submitLabel = "Simpan",
  cancelHref,
  onSubmit,
  children,
}: {
  backHref?: string;
  title?: string;
  subtitle?: string;
  width?: "single" | "wide";
  errorMessage?: string | null;
  isPending?: boolean;
  submitLabel?: string;
  cancelHref?: string;
  onSubmit: (formData: FormData) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "space-y-6",
        width === "single" ? "max-w-[760px]" : "max-w-[1120px]",
      )}
    >
      {(backHref || title) && (
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Kembali"
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface active:bg-admin-surface-muted",
                adminFocusRing,
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <div>
            {title && (
              <h2 className="admin-text-card-title text-admin-ink">{title}</h2>
            )}
            {subtitle && (
              <p className="admin-text-meta text-admin-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <form
        action={onSubmit}
        className="space-y-7 rounded-admin-inner border border-admin-line bg-admin-canvas p-5 md:rounded-admin-form md:p-10"
      >
        {errorMessage && (
          <div
            role="alert"
            className="rounded-admin-textarea bg-admin-rose-soft px-4 py-3 admin-text-body text-admin-rose-ink"
          >
            {errorMessage}
          </div>
        )}

        {children}

        <div className="flex flex-col-reverse gap-3 border-t border-admin-line pt-6 sm:flex-row sm:justify-end">
          {cancelHref && (
            <Link
              href={cancelHref}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-full border border-admin-line bg-admin-canvas px-6 admin-text-nav font-medium text-admin-ink transition-colors hover:bg-admin-surface active:bg-admin-surface-muted",
                adminFocusRing,
              )}
            >
              Batal
            </Link>
          )}
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-admin-ink px-7 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
              adminFocusRing,
            )}
          >
            {isPending ? "Menyimpan…" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
