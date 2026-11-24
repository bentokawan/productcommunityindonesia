"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import type { AdminEventRow } from "@/lib/queries/admin/content";
import { formatEventDate } from "@/lib/utils";
import { publicUrl } from "@/lib/supabase/storage";
import { StatusChip } from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";
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
              className="w-auto min-w-40"
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
              className="w-auto min-w-37.5"
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

      {filtered.length === 0 ? (
        <EmptyState
          title="Belum ada webinar"
          description="Tambahkan webinar baru untuk ditampilkan di beranda dan arsip."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="flex flex-col overflow-hidden rounded-admin-inner border border-admin-line bg-admin-canvas"
            >
              <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-admin-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(row.poster_path)}
                  alt={row.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 z-10">
                  <StatusChip tone={row.is_published ? "mint" : "neutral"}>
                    {row.is_published ? "Tampil" : "Disembunyikan"}
                  </StatusChip>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <p className="truncate admin-text-chip text-admin-text-secondary">
                    {row.edition_label} · {row.event_categories?.name ?? "—"}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-medium text-admin-ink">
                    {row.title}
                  </h3>
                  <p className="mt-1 truncate admin-text-label font-normal text-admin-text-secondary">
                    {row.speakers}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-admin-line pt-3">
                  <span className="truncate admin-text-chip font-normal text-admin-text-secondary">
                    {formatEventDate(row.starts_at)}
                  </span>
                  <RowActions
                    onEdit={() => router.push(`/admin/events/${row.id}`)}
                    onDelete={() => {
                      setDeleteError(null);
                      setDeleting(row);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
