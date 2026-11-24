"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import { publicUrl } from "@/lib/supabase/storage";
import { StatusChip } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { SortButtons } from "@/features/admin/ui/sort-buttons";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { ImageUpload } from "@/features/admin/ui/image-upload";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field, FieldGrid } from "@/features/admin/ui/form/fields";
import { AdminInput, CheckboxCard } from "@/features/admin/ui/form/controls";
import {
  moveTeamMember,
  removeTeamMember,
  saveTeamMember,
} from "@/features/admin/media/actions";

export function TeamManager({
  initialRows,
}: {
  initialRows: Tables<"team_members">[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"team_members"> | null>(null);
  const [deleting, setDeleting] = useState<Tables<"team_members"> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveTeamMember(formData);
      if (res.ok) {
        toast.success(
          editing ? "Pengurus diperbarui." : "Pengurus ditambahkan.",
        );
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
        addLabel="Tambah Pengurus"
        onAdd={() => {
          setErrorMessage(null);
          setFieldErrors({});
          setEditing(null);
          setOpen(true);
        }}
      />

      {initialRows.length === 0 ? (
        <EmptyState title="Belum ada pengurus" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {initialRows.map((member, idx) => (
            <div
              key={member.id}
              className="flex flex-col overflow-hidden rounded-admin-inner border border-admin-line bg-admin-canvas"
            >
              <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden bg-admin-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(member.photo_path)}
                  alt={member.name}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute top-3 left-3 z-10">
                  <StatusChip tone={member.is_published ? "mint" : "neutral"}>
                    {member.is_published ? "Tampil" : "Disembunyikan"}
                  </StatusChip>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="truncate font-medium text-admin-ink">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 truncate admin-text-label font-normal text-admin-text-secondary">
                    {member.role}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-admin-line pt-3">
                  <SortButtons
                    isFirst={idx === 0}
                    isLast={idx === initialRows.length - 1}
                    disabled={isPending}
                    onMove={(dir) =>
                      startTransition(async () => {
                        const res = await moveTeamMember(member.id, dir);
                        if (!res.ok) toast.error(res.message);
                      })
                    }
                  />
                  <RowActions
                    onEdit={() => {
                      setErrorMessage(null);
                      setFieldErrors({});
                      setEditing(member);
                      setOpen(true);
                    }}
                    onDelete={() => {
                      setDeleteError(null);
                      setDeleting(member);
                    }}
                  />
                </div>
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
        title={editing ? "Ubah Pengurus" : "Tambah Pengurus"}
        size="lg"
        mode={editing ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSave}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <Field label="Foto Pengurus (4:5)" required={!editing}>
          <ImageUpload
            name="photo"
            currentPath={editing?.photo_path}
            required={!editing}
            maxDimension={1200}
            cropAspect={4 / 5}
            cropAspectLabel="4:5"
          />
        </Field>
        <FieldGrid>
          <Field label="Nama" htmlFor="tm-name" required error={fieldErrors.name}>
            <AdminInput
              id="tm-name"
              name="name"
              required
              maxLength={60}
              defaultValue={editing?.name ?? ""}
            />
          </Field>
          <Field label="Peran" htmlFor="tm-role" required error={fieldErrors.role}>
            <AdminInput
              id="tm-role"
              name="role"
              required
              maxLength={60}
              defaultValue={editing?.role ?? ""}
            />
          </Field>
        </FieldGrid>
        <Field
          label="URL LinkedIn (opsional)"
          htmlFor="tm-li"
          error={fieldErrors.linkedin_url}
        >
          <AdminInput
            id="tm-li"
            name="linkedin_url"
            type="url"
            defaultValue={editing?.linkedin_url ?? ""}
            placeholder="https://www.linkedin.com/in/..."
          />
        </Field>
        <CheckboxCard
          id="tm-pub"
          name="is_published"
          label="Tampilkan di situs"
          defaultChecked={editing ? editing.is_published : true}
        />
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title="Hapus pengurus ini?"
        description={deleting ? `"${deleting.name}" akan dihapus.` : ""}
        onConfirm={() => {
          if (!deleting) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeTeamMember(deleting.id);
            if (res.ok) {
              toast.success("Pengurus dihapus.");
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
