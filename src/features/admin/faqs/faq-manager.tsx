"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import { DataTable, StatusChip } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { SortButtons } from "@/features/admin/ui/sort-buttons";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field } from "@/features/admin/ui/form/fields";
import {
  AdminInput,
  AdminTextarea,
  CheckboxCard,
} from "@/features/admin/ui/form/controls";
import { moveFaq, removeFaq, saveFaq } from "@/features/admin/faqs/actions";

export function FaqManager({ initialRows }: { initialRows: Tables<"faqs">[] }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Tables<"faqs"> | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Tables<"faqs"> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialRows;
    return initialRows.filter(
      (r) =>
        r.question.toLowerCase().includes(q) ||
        r.answer.toLowerCase().includes(q),
    );
  }, [initialRows, search]);

  function openCreate() {
    setErrorMessage(null);
    setFieldErrors({});
    setEditing(null);
    setCreating(true);
  }

  function openEdit(row: Tables<"faqs">) {
    setErrorMessage(null);
    setFieldErrors({});
    setCreating(false);
    setEditing(row);
  }

  function handleSave(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveFaq(formData);
      if (res.ok) {
        toast.success(editing ? "FAQ diperbarui." : "FAQ ditambahkan.");
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
      const res = await removeFaq(deleting.id);
      if (res.ok) {
        toast.success("FAQ dihapus.");
        setDeleting(null);
      } else {
        setDeleteError(res.message);
      }
    });
  }

  function handleMove(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const res = await moveFaq(id, direction);
      if (!res.ok) {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari pertanyaan…"
        addLabel="Tambah FAQ"
        onAdd={openCreate}
      />

      <DataTable
        rows={filtered}
        getRowKey={(r) => r.id}
        emptyTitle="Belum ada FAQ"
        emptyDescription="Tambahkan pertanyaan yang sering diajukan anggota komunitas."
        columns={[
          {
            key: "question",
            header: "Pertanyaan",
            cell: (row) => (
              <div className="max-w-[460px]">
                <p className="font-medium text-admin-ink">{row.question}</p>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-admin-text-secondary">
                  {row.answer}
                </p>
              </div>
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
            key: "order",
            header: "Urutan",
            cell: (row, idx) => (
              <SortButtons
                isFirst={idx === 0}
                isLast={idx === filtered.length - 1}
                disabled={isPending || search.trim().length > 0}
                onMove={(dir) => handleMove(row.id, dir)}
              />
            ),
          },
          {
            key: "actions",
            header: "Aksi",
            className: "text-right",
            cell: (row) => (
              <RowActions
                onEdit={() => openEdit(row)}
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
        title={editing ? "Ubah FAQ" : "Tambah FAQ"}
        subtitle="Pertanyaan yang tampil di section FAQ beranda."
        size="md"
        mode={editing ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSave}
      >
        {editing && <input type="hidden" name="id" value={editing.id} />}

        <Field
          label="Pertanyaan"
          htmlFor="faq-question"
          required
          error={fieldErrors.question}
        >
          <AdminInput
            id="faq-question"
            name="question"
            required
            maxLength={160}
            defaultValue={editing?.question ?? ""}
            placeholder="Mis. Apakah gabung komunitas PCI berbayar?"
          />
        </Field>

        <Field
          label="Jawaban"
          htmlFor="faq-answer"
          required
          error={fieldErrors.answer}
        >
          <AdminTextarea
            id="faq-answer"
            name="answer"
            required
            maxLength={1000}
            defaultValue={editing?.answer ?? ""}
            placeholder="Tulis jawaban yang singkat dan jelas…"
          />
        </Field>

        <CheckboxCard
          id="faq-published"
          name="is_published"
          label="Tampilkan di situs"
          description="Nonaktifkan jika ingin menyembunyikan pertanyaan ini sementara."
          defaultChecked={editing ? editing.is_published : true}
        />
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Hapus FAQ ini?"
        description={
          deleting ? `"${deleting.question}" akan dihapus permanen.` : ""
        }
        onConfirm={handleDelete}
        loading={isPending}
        errorMessage={deleteError}
      />
    </div>
  );
}
