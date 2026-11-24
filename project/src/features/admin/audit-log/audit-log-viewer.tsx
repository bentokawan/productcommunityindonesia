"use client";

import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { DataTable, StatusChip } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { AdminSheet } from "@/features/admin/ui/admin-sheet";
import { AdminSelect } from "@/features/admin/ui/form/controls";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

const ACTION_TONE: Record<string, "mint" | "butter" | "rose"> = {
  insert: "mint",
  update: "butter",
  delete: "rose",
};

export function AuditLogViewer({
  rows,
}: {
  rows: Tables<"audit_logs">[];
}) {
  const [tableFilter, setTableFilter] = useState("all");
  const [selected, setSelected] = useState<Tables<"audit_logs"> | null>(null);

  const tables = useMemo(
    () => Array.from(new Set(rows.map((r) => r.table_name))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    if (tableFilter === "all") return rows;
    return rows.filter((r) => r.table_name === tableFilter);
  }, [rows, tableFilter]);

  return (
    <div className="space-y-6">
      <TableToolbar
        filters={
          <AdminSelect
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            aria-label="Saring modul"
            className="w-auto min-w-50"
          >
            <option value="all">Semua tabel</option>
            {tables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </AdminSelect>
        }
      />

      <DataTable
        rows={filtered}
        getRowKey={(r) => String(r.id)}
        emptyTitle="Belum ada log aktivitas"
        emptyDescription="Perubahan konten lewat CMS akan tercatat otomatis di sini."
        columns={[
          {
            key: "time",
            header: "Waktu",
            cell: (row) => (
              <span className="admin-text-label font-normal text-admin-text-secondary">
                {new Date(row.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                })}
              </span>
            ),
          },
          {
            key: "table",
            header: "Tabel",
            cell: (row) => (
              <code className="rounded-full bg-admin-surface px-2.5 py-1 admin-text-chip font-normal text-admin-ink">
                {row.table_name}
              </code>
            ),
          },
          {
            key: "action",
            header: "Aksi",
            cell: (row) => (
              <StatusChip tone={ACTION_TONE[row.action] ?? "neutral"}>
                {row.action}
              </StatusChip>
            ),
          },
          {
            key: "detail",
            header: "Detail",
            className: "text-right",
            cell: (row) => (
              <button
                type="button"
                onClick={() => setSelected(row)}
                aria-label="Lihat detail perubahan"
                className={cn(
                  "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink transition-colors hover:bg-admin-surface-muted active:scale-95",
                  adminFocusRing,
                )}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            ),
          },
        ]}
      />

      <AdminSheet
        open={selected !== null}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        title={selected ? `${selected.table_name} (${selected.action})` : ""}
        subtitle={
          selected
            ? `Record: ${selected.record_id} · ${new Date(
                selected.created_at,
              ).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`
            : undefined
        }
      >
        {selected && (
          <div className="space-y-5 admin-text-label font-normal">
            <div>
              <p className="mb-1.5 font-medium text-admin-text-secondary">
                Sebelum (old_data)
              </p>
              <pre className="max-h-60 overflow-auto rounded-admin-textarea bg-admin-surface p-4 admin-text-chip font-normal text-admin-ink">
                {JSON.stringify(selected.old_data, null, 2)}
              </pre>
            </div>
            <div>
              <p className="mb-1.5 font-medium text-admin-text-secondary">
                Sesudah (new_data)
              </p>
              <pre className="max-h-60 overflow-auto rounded-admin-textarea bg-admin-surface p-4 admin-text-chip font-normal text-admin-ink">
                {JSON.stringify(selected.new_data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </AdminSheet>
    </div>
  );
}
