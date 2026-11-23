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
  movePartner,
  removePartner,
  savePartner,
} from "@/features/admin/content/actions";

export function PartnersManager({
  initialRows,
}: {
  initialRows: Tables<"partners">[];
}) {
  const [editing, setEditing] = useState<Tables<"partners"> | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Tables<"partners"> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await savePartner(formData);
      if (res.ok) {
        toast.success(editing ? "Partner diperbarui." : "Partner ditambahkan.");
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
        addLabel="Tambah Partner"
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
        emptyTitle="Belum ada partner"
        columns={[
          {
            key: "name",
            header: "Nama Partner",
            cell: (row) => (
              <span className="font-medium text-admin-ink">{row.name}</span>
            ),
          },
          {
            key: "url",
            header: "URL",
            cell: (row) => (
              <span className="text-[13px] text-admin-text-secondary">
                {row.url ?? "—"}
              </span>
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
                    const res = await movePartner(row.id, dir);
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
        title={editing ? "Ubah Partner" : "Tambah Partner"}
        size="sm"
        mode={editing ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSave}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <Field label="Nama Partner" htmlFor="p-name" required error={fieldErrors.name}>
          <AdminInput
            id="p-name"
            name="name"
            required
            maxLength={60}
            defaultValue={editing?.name ?? ""}
          />
        </Field>
        <Field
          label="URL (opsional)"
          htmlFor="p-url"
          hint="Harus diawali https:// jika diisi."
          error={fieldErrors.url}
        >
          <AdminInput
            id="p-url"
            name="url"
            type="url"
            defaultValue={editing?.url ?? ""}
            placeholder="https://..."
          />
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus partner ini?"
        description={deleting ? `"${deleting.name}" akan dihapus.` : ""}
        onConfirm={() => {
          if (!deleting) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removePartner(deleting.id);
            if (res.ok) {
              toast.success("Partner dihapus.");
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
