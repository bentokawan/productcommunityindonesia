"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminFocusRing } from "@/features/admin/ui/form/controls";

export interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  editHref?: string;
}

export function RowActions({
  onEdit,
  onDelete,
  editLabel = "Ubah",
  deleteLabel = "Hapus",
}: RowActionsProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          title={editLabel}
          className={cn(
            "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink transition-colors hover:bg-admin-surface-muted active:scale-95",
            adminFocusRing,
          )}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={deleteLabel}
          title={deleteLabel}
          className={cn(
            "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-danger transition-colors hover:bg-admin-rose-soft active:scale-95",
            adminFocusRing,
          )}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
