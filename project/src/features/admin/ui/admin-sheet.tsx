"use client";

import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminFocusRing } from "@/features/admin/ui/form/controls";

export interface AdminSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AdminSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
}: AdminSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-admin-card border border-admin-line bg-admin-canvas p-6 shadow-(--admin-shadow-overlay) focus:outline-none md:inset-y-3 md:right-3 md:left-auto md:max-h-none md:w-[520px] md:rounded-admin-card md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-admin-line pb-4">
            <div>
              <Dialog.Title className="admin-text-modal-title text-admin-ink">
                {title}
              </Dialog.Title>
              {subtitle && (
                <Dialog.Description className="mt-1 admin-text-label font-normal text-admin-text-secondary">
                  {subtitle}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Tutup panel"
              className={cn(
                "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink transition-colors hover:bg-admin-surface-muted active:scale-95",
                adminFocusRing,
              )}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
