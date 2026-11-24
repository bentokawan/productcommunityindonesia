"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import { DataTable } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { SortButtons } from "@/features/admin/ui/sort-buttons";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field } from "@/features/admin/ui/form/fields";
import { AdminInput, AdminTextarea } from "@/features/admin/ui/form/controls";
import {
  moveActivity,
  removeActivity,
  saveActivity,
} from "@/features/admin/content/actions";

export function ActivitiesManager({
  initialRows,
}: {
  initialRows: Tables<"activities">[];
}) {
  const [editing, setEditing] = useState<Tables<"activities"> | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Tables<"activities"> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveActivity(formData);
      if (res.ok) {
        toast.success(editing ? "Kegiatan diperbarui." : "Kegiatan ditambahkan.");
        setCreating(false);
        setEditing(null);
      } else {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    setDeleteError(null);
    startTransition(async () => {
      const res = await removeActivity(deleting.id);
      if (res.ok) {
        toast.success("Kegiatan dihapus.");
        setDeleting(null);
      } else {
        setDeleteError(res.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <TableToolbar
        addLabel="Tambah Kegiatan"
        onAdd={() => {
          setErrorMessage(null);
          setFieldErrors({});
          setEditing(null);
          setCreating(true);
        }}
      />

      <DataTable
        rows={initialRows}
        getRowKey={(r) => r.id}
        emptyTitle="Belum ada kegiatan"
        columns={[
          {
            key: "title",
            header: "Kegiatan",
            cell: (row) => (
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-admin-textarea bg-admin-surface text-xl leading-none">
                  {row.emoji}
                </span>
                <div>
                  <p className="font-medium text-admin-ink">{row.title}</p>
                  <p className="line-clamp-1 admin-text-chip font-normal text-admin-text-secondary">
                    {row.description}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "order",
            header: "Urutan",
            cell: (row, idx) => (
              <SortButtons
                isFirst={idx === 0}
                isLast={idx === initialRows.length - 1}
                disabled={isPending}
                onMove={(dir) =>
                  startTransition(async () => {
                    const res = await moveActivity(row.id, dir);
                    if (!res.ok) toast.error(res.message);
                  })
                }
              />
            ),
          },
          {
            key: "actions",
            header: "Aksi",
            className: "text-right",
            cell: (row) => (
              <RowActions
                onEdit={() => {
                  setErrorMessage(null);
                  setFieldErrors({});
                  setCreating(false);
                  setEditing(row);
                }}
                onDelete={() => {
                  setDeleteError(null);
                  setDeleting(row);
                }}
              />
            ),
          },
        ]}
      />

      <FormDialog
        open={creating || editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
        title={editing ? "Ubah Kegiatan" : "Tambah Kegiatan"}
        size="md"
        mode={editing ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSave}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <Field label="Emoji" htmlFor="act-emoji" required error={fieldErrors.emoji}>
          <AdminInput
            id="act-emoji"
            name="emoji"
            required
            maxLength={8}
            defaultValue={editing?.emoji ?? ""}
            placeholder="Mis. 🎙️"
          />
        </Field>
        <Field label="Judul" htmlFor="act-title" required error={fieldErrors.title}>
          <AdminInput
            id="act-title"
            name="title"
            required
            maxLength={60}
            defaultValue={editing?.title ?? ""}
            placeholder="Mis. Sharing Session"
          />
        </Field>
        <Field
          label="Deskripsi"
          htmlFor="act-desc"
          required
          error={fieldErrors.description}
        >
          <AdminTextarea
            id="act-desc"
            name="description"
            required
            maxLength={200}
            defaultValue={editing?.description ?? ""}
          />
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus kegiatan ini?"
        description={deleting ? `"${deleting.title}" akan dihapus.` : ""}
        onConfirm={handleDelete}
        loading={isPending}
        errorMessage={deleteError}
      />
    </div>
  );
}
