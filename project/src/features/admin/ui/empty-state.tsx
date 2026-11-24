import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title = "Belum ada data",
  description = "Tambahkan item pertama untuk menampilkannya di sini.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-admin-inner border border-dashed border-admin-line-strong bg-admin-surface/40 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-surface text-admin-text-secondary">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 admin-text-modal-title font-medium text-admin-ink">
        {title}
      </h3>
      <p className="mt-1.5 max-w-90 admin-text-body text-admin-text-secondary">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
