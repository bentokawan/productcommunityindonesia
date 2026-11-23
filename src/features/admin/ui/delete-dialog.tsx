"use client";

import { Dialog } from "radix-ui";
import { AlertTriangle, X } from "lucide-react";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  loading?: boolean;
  errorMessage?: string | null;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading,
  errorMessage,
}: DeleteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-admin-line bg-admin-canvas p-6 shadow-(--admin-shadow-overlay) focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admin-rose-soft text-admin-rose-ink">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <Dialog.Title className="text-[18px] font-semibold text-admin-ink md:text-[20px]">
                {title}
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Tutup dialog"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink hover:bg-admin-surface-muted"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-3 text-[14px] text-admin-text-secondary">
            {description}
          </Dialog.Description>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 rounded-2xl bg-admin-rose-soft px-4 py-3 text-[13px] text-admin-rose-ink"
            >
              {errorMessage}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="h-11 cursor-pointer rounded-full border border-admin-line bg-admin-canvas px-5 text-[14px] font-medium text-admin-ink hover:bg-admin-surface"
              >
                Batal
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="h-11 cursor-pointer rounded-full bg-admin-danger px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Menghapus…" : "Hapus"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
