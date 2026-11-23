"use client";

import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import { Pencil, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  mode?: "create" | "edit";
  isPending?: boolean;
  errorMessage?: string | null;
  submitLabel?: string;
  onSubmit: (formData: FormData) => void;
  children: ReactNode;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "sm:max-w-[440px]",
  md: "sm:max-w-[560px]",
  lg: "sm:max-w-[720px]",
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  size = "md",
  mode = "create",
  isPending,
  errorMessage,
  submitLabel = "Simpan",
  onSubmit,
  children,
}: FormDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-[28px] border border-admin-line bg-admin-canvas p-6 shadow-(--admin-shadow-overlay) focus:outline-none sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100%-32px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[32px] sm:p-8",
            SIZE_CLASSES[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-admin-line pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admin-ink text-admin-on-ink">
                {mode === "create" ? (
                  <Plus className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <div>
                <Dialog.Title className="text-[18px] font-semibold text-admin-ink sm:text-[20px]">
                  {title}
                </Dialog.Title>
                {subtitle && (
                  <Dialog.Description className="text-[13px] text-admin-text-secondary">
                    {subtitle}
                  </Dialog.Description>
                )}
              </div>
            </div>

            <Dialog.Close
              aria-label="Tutup dialog"
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink hover:bg-admin-surface-muted"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <form action={onSubmit} className="mt-5 space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="rounded-2xl bg-admin-rose-soft px-4 py-3 text-[13px] text-admin-rose-ink"
              >
                {errorMessage}
              </div>
            )}

            {children}

            <div className="flex items-center justify-end gap-3 border-t border-admin-line pt-5">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isPending}
                  className="h-11 cursor-pointer rounded-full border border-admin-line bg-admin-canvas px-5 text-[14px] font-medium text-admin-ink hover:bg-admin-surface"
                >
                  Batal
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending}
                className="h-11 cursor-pointer rounded-full bg-admin-ink px-6 text-[14px] font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft disabled:opacity-50"
              >
                {isPending ? "Menyimpan…" : submitLabel}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
