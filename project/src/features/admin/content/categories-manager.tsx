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
import { AdminInput } from "@/features/admin/ui/form/controls";
import {
  moveEventCategory,
  removeEventCategory,
  saveEventCategory,
} from "@/features/admin/content/actions";

export function CategoriesManager({
  initialRows,
}: {
  initialRows: Tables<"event_categories">[];
}) {
  const [editing, setEditing] = useState<Tables<"event_categories"> | null>(
    null,
  );
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Tables<"event_categories"> | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveEventCategory(formData);
      if (res.ok) {
        toast.success(editing ? "Kategori diperbarui." : "Kategori ditambahkan.");
        setCreating(false);
        setEditing(null);
      } else {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  return (
    <div className="space-y-6">
      <TableToolbar
        addLabel="Tambah Kategori"
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
        emptyTitle="Belum ada kategori"
        columns={[
          {
            key: "name",
            header: "Nama Kategori",
            cell: (row) => (
              <span className="font-medium text-admin-ink">{row.name}</span>
            ),
          },
          {
            key: "slug",
            header: "Slug",
            cell: (row) => (
              <code className="rounded-full bg-admin-surface px-2.5 py-1 admin-text-chip font-normal text-admin-text-secondary">
                {row.slug}
              </code>
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
                    const res = await moveEventCategory(row.id, dir);
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
        title={editing ? "Ubah Kategori" : "Tambah Kategori"}
        size="sm"
        mode={editing ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSave}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <Field label="Nama" htmlFor="cat-name" required error={fieldErrors.name}>
          <AdminInput
            id="cat-name"
            name="name"
            required
            maxLength={40}
            defaultValue={editing?.name ?? ""}
          />
        </Field>
        <Field
          label="Slug"
          htmlFor="cat-slug"
          required
          hint="Huruf kecil, angka, dan tanda hubung (mis. sharing-session)."
          error={fieldErrors.slug}
        >
          <AdminInput
            id="cat-slug"
            name="slug"
            required
            maxLength={40}
            defaultValue={editing?.slug ?? ""}
          />
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus kategori ini?"
        description={
          deleting
            ? `Kategori "${deleting.name}" hanya bisa dihapus jika belum dipakai oleh webinar mana pun.`
            : ""
        }
        onConfirm={() => {
          if (!deleting) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeEventCategory(deleting.id);
            if (res.ok) {
              toast.success("Kategori dihapus.");
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
