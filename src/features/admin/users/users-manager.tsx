"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import { DataTable, StatusChip } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field } from "@/features/admin/ui/form/fields";
import {
  AdminInput,
  AdminSelect,
  CheckboxCard,
} from "@/features/admin/ui/form/controls";
import {
  inviteCmsUser,
  removeCmsUser,
  updateCmsUser,
} from "@/features/admin/users/actions";

export function UsersManager({
  initialRows,
  currentUserId,
}: {
  initialRows: Tables<"profiles">[];
  currentUserId: string;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"profiles"> | null>(null);
  const [deleting, setDeleting] = useState<Tables<"profiles"> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInvite(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await inviteCmsUser(formData);
      if (res.ok) {
        toast.success("Undangan dikirim ke email pengguna.");
        setInviteOpen(false);
      } else {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  function handleUpdate(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await updateCmsUser(formData);
      if (res.ok) {
        toast.success("Akses pengguna diperbarui.");
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
        addLabel="Undang Pengguna"
        onAdd={() => {
          setErrorMessage(null);
          setFieldErrors({});
          setInviteOpen(true);
        }}
      />

      <DataTable
        rows={initialRows}
        getRowKey={(r) => r.user_id}
        emptyTitle="Belum ada pengguna CMS"
        columns={[
          {
            key: "name",
            header: "Nama",
            cell: (row) => (
              <div>
                <span className="font-medium text-admin-ink">
                  {row.full_name}
                </span>
                {row.user_id === currentUserId && (
                  <span className="ml-2 text-[12px] text-admin-text-secondary">
                    (Kamu)
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            cell: (row) => (
              <StatusChip tone={row.role === "admin" ? "mint" : "lilac"}>
                {row.role === "admin" ? "Admin" : "Editor"}
              </StatusChip>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => (
              <StatusChip tone={row.is_active ? "mint" : "rose"}>
                {row.is_active ? "Aktif" : "Nonaktif"}
              </StatusChip>
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
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Undang Pengguna CMS"
        subtitle="Kirim undangan masuk via email dengan role tertentu."
        size="sm"
        mode="create"
        submitLabel="Kirim Undangan"
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleInvite}
      >
        <Field label="Nama lengkap" htmlFor="u-name" required error={fieldErrors.full_name}>
          <AdminInput id="u-name" name="full_name" required maxLength={80} />
        </Field>
        <Field label="Email" htmlFor="u-email" required error={fieldErrors.email}>
          <AdminInput
            id="u-email"
            name="email"
            type="email"
            required
            placeholder="nama@domain.com"
          />
        </Field>
        <Field label="Role" htmlFor="u-role" required error={fieldErrors.role}>
          <AdminSelect id="u-role" name="role" defaultValue="editor">
            <option value="editor">Editor (Kelola konten)</option>
            <option value="admin">Admin (Akses penuh)</option>
          </AdminSelect>
        </Field>
      </FormDialog>

      <FormDialog
        open={editing !== null}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
        title={`Atur Akses — ${editing?.full_name ?? ""}`}
        size="sm"
        mode="edit"
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleUpdate}
      >
        {editing && (
          <input type="hidden" name="user_id" value={editing.user_id} />
        )}
        <Field label="Role" htmlFor="eu-role" required error={fieldErrors.role}>
          <AdminSelect
            id="eu-role"
            name="role"
            defaultValue={editing?.role ?? "editor"}
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </AdminSelect>
        </Field>
        <CheckboxCard
          id="eu-active"
          name="is_active"
          label="Akun aktif"
          description="Nonaktifkan untuk mencabut akses CMS sementara."
          defaultChecked={editing?.is_active ?? true}
        />
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title="Hapus pengguna ini?"
        description={
          deleting
            ? `Akses "${deleting.full_name}" akan dihapus permanen. Sistem menolak jika ini adalah admin aktif terakhir.`
            : ""
        }
        onConfirm={() => {
          if (!deleting) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeCmsUser(deleting.user_id);
            if (res.ok) {
              toast.success("Pengguna dihapus.");
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
