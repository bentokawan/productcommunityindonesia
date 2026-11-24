import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/features/admin/ui/empty-state";

export type ChipTone =
  | "mint"
  | "peach"
  | "rose"
  | "butter"
  | "lilac"
  | "neutral";

const CHIP_STYLES: Record<
  ChipTone,
  { wrap: string; dot: string }
> = {
  mint: {
    wrap: "bg-admin-mint-soft text-admin-mint-ink",
    dot: "bg-admin-mint-dot",
  },
  peach: {
    wrap: "bg-admin-peach-soft text-admin-peach-ink",
    dot: "bg-admin-peach-dot",
  },
  rose: {
    wrap: "bg-admin-rose-soft text-admin-rose-ink",
    dot: "bg-admin-rose-dot",
  },
  butter: {
    wrap: "bg-admin-butter-soft text-admin-butter-ink",
    dot: "bg-admin-butter-dot",
  },
  lilac: {
    wrap: "bg-admin-lilac-soft text-admin-lilac-ink",
    dot: "bg-admin-lilac-dot",
  },
  neutral: {
    wrap: "bg-admin-surface-muted text-admin-text-secondary",
    dot: "bg-admin-text-faint",
  },
};

export function StatusChip({
  tone = "neutral",
  children,
  className,
}: {
  tone?: ChipTone;
  children: ReactNode;
  className?: string;
}) {
  const styles = CHIP_STYLES[tone];
  return (
    <span
      className={cn(
        "inline-flex h-6.5 items-center gap-1.5 rounded-full px-2.5 admin-text-chip whitespace-nowrap",
        styles.wrap,
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", styles.dot)}
        aria-hidden="true"
      />
      <span>{children}</span>
    </span>
  );
}

export interface DataColumn<T> {
  key: string;
  header: string;
  className?: string;
  cell: (row: T, index: number) => ReactNode;
  mobileLabel?: string;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataColumn<T>[];
  getRowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={getRowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.cell(row, idx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row, idx) => (
          <div
            key={getRowKey(row)}
            className="space-y-3 rounded-admin-inner border border-admin-line bg-admin-canvas p-5"
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex items-start justify-between gap-4 admin-text-body"
              >
                <span className="shrink-0 admin-text-chip text-admin-text-secondary">
                  {col.mobileLabel ?? col.header}
                </span>
                <div className="min-w-0 text-right">{col.cell(row, idx)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
