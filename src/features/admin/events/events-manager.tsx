"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import type { AdminEventRow } from "@/lib/queries/admin/content";
import { formatEventDate } from "@/lib/utils";
import { publicUrl } from "@/lib/supabase/storage";
import { DataTable, StatusChip } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { AdminSelect } from "@/features/admin/ui/form/controls";
import { removeEvent } from "@/features/admin/events/actions";

export function EventsManager({
  initialRows,
  categories,
}: {
  initialRows: AdminEventRow[];
  categories: Tables<"event_categories">[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState<AdminEventRow | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [nowMs] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialRows.filter((row) => {
      if (q) {
        const matches =
          row.title.toLowerCase().includes(q) ||
          row.edition_label.toLowerCase().includes(q) ||
          row.speakers.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (categoryFilter !== "all" && row.category_id !== categoryFilter) {
        return false;
      }
      if (statusFilter === "published" && !row.is_published) return false;
      if (statusFilter === "draft" && row.is_published) return false;
      if (
        statusFilter === "upcoming" &&
        new Date(row.starts_at).getTime() <= nowMs
      ) {
        return false;
      }
      if (
        statusFilter === "past" &&
        new Date(row.starts_at).getTime() > nowMs
      ) {
        return false;
      }
      return true;
    });
  }, [initialRows, search, categoryFilter, statusFilter, nowMs]);

  return (
    <div className="space-y-6">
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul, edisi, pembicara…"
        addLabel="Tambah Webinar"
        addHref="/admin/events/new"
        filters={
          <div className="flex flex-wrap gap-2">
            <AdminSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Saring kategori"
              className="w-auto min-w-[160px]"
            >
              <option value="all">Semua kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Saring status"
              className="w-auto min-w-[150px]"
            >
              <option value="all">Semua status</option>
              <option value="published">Tampil</option>
              <option value="draft">Disembunyikan</option>
              <option value="upcoming">Akan datang</option>
              <option value="past">Sudah lewat</option>
            </AdminSelect>
          </div>
        }
      />

      <DataTable
        rows={filtered}
        getRowKey={(r) => r.id}
        emptyTitle="Belum ada webinar"
        emptyDescription="Tambahkan webinar baru untuk ditampilkan di beranda dan arsip."
        columns={[
          {
            key: "title",
            header: "Webinar",
            cell: (row) => (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(row.poster_path)}
                  alt={row.title}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-admin-text-secondary">
                    {row.edition_label} · {row.event_categories?.name ?? "—"}
                  </p>
                  <p className="truncate font-medium text-admin-ink">
                    {row.title}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "date",
            header: "Jadwal",
            cell: (row) => (
              <span className="text-[13px] text-admin-text-secondary">
                {formatEventDate(row.starts_at)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => (
              <StatusChip tone={row.is_published ? "mint" : "neutral"}>
                {row.is_published ? "Tampil" : "Disembunyikan"}
              </StatusChip>
            ),
          },
          {
            key: "actions",
            header: "Aksi",
            className: "text-right",
            cell: (row) => (
              <RowActions
                onEdit={() => router.push(`/admin/events/${row.id}`)}
                onDelete={() => {
                  setDeleteError(null);
                  setDeleting(row);
                }}
              />
            ),
          },
        ]}
      />

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title="Hapus webinar ini?"
        description={deleting ? `"${deleting.title}" akan dihapus.` : ""}
        onConfirm={() => {
          if (!deleting) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeEvent(deleting.id);
            if (res.ok) {
              toast.success("Webinar dihapus.");
              setDeleting(null);
            } else {
              setDeleteError(res.message);
            }
          });
        }}
        loading={isPending}
        errorMessage={deleteError}
      />
    </div>
  );
}
