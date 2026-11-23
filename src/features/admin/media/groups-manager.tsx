"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import { publicUrl } from "@/lib/supabase/storage";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { SortButtons } from "@/features/admin/ui/sort-buttons";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { ImageUpload } from "@/features/admin/ui/image-upload";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field } from "@/features/admin/ui/form/fields";
import { AdminInput, AdminTextarea } from "@/features/admin/ui/form/controls";
import {
  moveCommunityGroup,
  removeCommunityGroup,
  saveCommunityGroup,
} from "@/features/admin/media/actions";

export function GroupsManager({
  initialRows,
}: {
  initialRows: Tables<"community_groups">[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"community_groups"> | null>(
    null,
  );
  const [deleting, setDeleting] = useState<Tables<"community_groups"> | null>(
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
      const res = await saveCommunityGroup(formData);
      if (res.ok) {
        toast.success(editing ? "Grup diperbarui." : "Grup ditambahkan.");
        setOpen(false);
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
        addLabel="Tambah Grup"
        onAdd={() => {
          setErrorMessage(null);
          setFieldErrors({});
          setEditing(null);
          setOpen(true);
        }}
      />

      {initialRows.length === 0 ? (
        <EmptyState title="Belum ada grup komunitas" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {initialRows.map((group, idx) => (
            <div
              key={group.id}
              className="flex flex-col justify-between rounded-[24px] border border-admin-line bg-admin-canvas p-5"
            >
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(group.logo_path)}
                  alt={group.name}
                  className="h-16 w-16 shrink-0 rounded-full border border-admin-line object-cover"
                />
                <div className="min-w-0">
                  <h3 className="font-medium text-admin-ink">{group.name}</h3>
                  <p className="mt-1 text-[13px] text-admin-text-secondary">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-admin-line pt-4">
                <SortButtons
                  isFirst={idx === 0}
                  isLast={idx === initialRows.length - 1}
                  disabled={isPending}
                  onMove={(dir) =>
                    startTransition(async () => {
                      const res = await moveCommunityGroup(group.id, dir);
                      if (!res.ok) toast.error(res.message);
                    })
                  }
                />
                <RowActions
                  onEdit={() => {
                    setErrorMessage(null);
                    setFieldErrors({});
                    setEditing(group);
                    setOpen(true);
                  }}
                  onDelete={() => {
                    setDeleteError(null);
                    setDeleting(group);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <FormDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        title={editing ? "Ubah Grup" : "Tambah Grup"}
        size="lg"
        mode={editing ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSave}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <Field label="Logo Grup (1:1)" required={!editing}>
          <ImageUpload
            name="logo"
            currentPath={editing?.logo_path}
            required={!editing}
            aspectClass="aspect-square w-24"
          />
        </Field>
        <Field label="Nama Grup" htmlFor="grp-name" required error={fieldErrors.name}>
          <AdminInput
            id="grp-name"
            name="name"
            required
            maxLength={60}
            defaultValue={editing?.name ?? ""}
          />
        </Field>
        <Field
          label="Deskripsi"
          htmlFor="grp-desc"
          required
          error={fieldErrors.description}
        >
          <AdminTextarea
            id="grp-desc"
            name="description"
            required
            maxLength={200}
            defaultValue={editing?.description ?? ""}
          />
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title="Hapus grup ini?"
        description={deleting ? `"${deleting.name}" akan dihapus.` : ""}
        onConfirm={() => {
          if (!deleting) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeCommunityGroup(deleting.id);
            if (res.ok) {
              toast.success("Grup dihapus.");
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
