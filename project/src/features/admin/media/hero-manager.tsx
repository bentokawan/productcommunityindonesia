"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import { publicUrl } from "@/lib/supabase/storage";
import { DataTable, StatusChip } from "@/features/admin/ui/data-table";
import { TableToolbar } from "@/features/admin/ui/table-toolbar";
import { SortButtons } from "@/features/admin/ui/sort-buttons";
import { RowActions } from "@/features/admin/ui/row-actions";
import { DeleteDialog } from "@/features/admin/ui/delete-dialog";
import { ImageUpload } from "@/features/admin/ui/image-upload";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field, FieldGrid } from "@/features/admin/ui/form/fields";
import { AdminInput, CheckboxCard } from "@/features/admin/ui/form/controls";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";
import {
  moveHeroSlide,
  moveSiteStat,
  removeHeroSlide,
  removeSiteStat,
  saveHeroSlide,
  saveSiteStat,
} from "@/features/admin/media/actions";

export function HeroManager({
  slides,
  stats,
}: {
  slides: Tables<"hero_slides">[];
  stats: Tables<"site_stats">[];
}) {
  const [tab, setTab] = useState<"slides" | "stats">("slides");

  // Slide states
  const [slideOpen, setSlideOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Tables<"hero_slides"> | null>(
    null,
  );
  const [deletingSlide, setDeletingSlide] =
    useState<Tables<"hero_slides"> | null>(null);

  // Stat states
  const [statOpen, setStatOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Tables<"site_stats"> | null>(
    null,
  );
  const [deletingStat, setDeletingStat] = useState<Tables<"site_stats"> | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSaveSlide(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveHeroSlide(formData);
      if (res.ok) {
        toast.success(
          editingSlide ? "Slide diperbarui." : "Slide ditambahkan.",
        );
        setSlideOpen(false);
        setEditingSlide(null);
      } else {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  function handleSaveStat(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveSiteStat(formData);
      if (res.ok) {
        toast.success(
          editingStat ? "Statistik diperbarui." : "Statistik ditambahkan.",
        );
        setStatOpen(false);
        setEditingStat(null);
      } else {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-full bg-admin-surface p-1">
        <button
          type="button"
          onClick={() => setTab("slides")}
          className={cn(
            "h-10 cursor-pointer rounded-full px-5 admin-text-body font-medium transition-colors active:opacity-90",
            adminFocusRing,
            tab === "slides"
              ? "bg-admin-ink text-admin-on-ink"
              : "text-admin-text-secondary hover:text-admin-ink",
          )}
        >
          Slide ({slides.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("stats")}
          className={cn(
            "h-10 cursor-pointer rounded-full px-5 admin-text-body font-medium transition-colors active:opacity-90",
            adminFocusRing,
            tab === "stats"
              ? "bg-admin-ink text-admin-on-ink"
              : "text-admin-text-secondary hover:text-admin-ink",
          )}
        >
          Statistik ({stats.length}/4)
        </button>
      </div>

      {tab === "slides" ? (
        <div className="space-y-6">
          <TableToolbar
            addLabel="Tambah Slide"
            onAdd={() => {
              setErrorMessage(null);
              setFieldErrors({});
              setEditingSlide(null);
              setSlideOpen(true);
            }}
          />

          {slides.length === 0 ? (
            <EmptyState
              title="Belum ada slide hero"
              description="Tambahkan foto kegiatan untuk tampil di slider hero beranda."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="flex flex-col overflow-hidden rounded-admin-inner border border-admin-line bg-admin-canvas"
                >
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-admin-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl(slide.image_path)}
                      alt={slide.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <StatusChip tone={slide.is_published ? "mint" : "neutral"}>
                        {slide.is_published ? "Tampil" : "Disembunyikan"}
                      </StatusChip>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <p className="font-medium text-admin-ink">
                        {slide.caption}
                      </p>
                      <p className="mt-1 line-clamp-2 admin-text-chip font-normal text-admin-text-secondary">
                        {slide.alt}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-admin-line pt-4">
                      <SortButtons
                        isFirst={idx === 0}
                        isLast={idx === slides.length - 1}
                        disabled={isPending}
                        onMove={(dir) =>
                          startTransition(async () => {
                            const res = await moveHeroSlide(slide.id, dir);
                            if (!res.ok) toast.error(res.message);
                          })
                        }
                      />
                      <RowActions
                        onEdit={() => {
                          setErrorMessage(null);
                          setFieldErrors({});
                          setEditingSlide(slide);
                          setSlideOpen(true);
                        }}
                        onDelete={() => {
                          setDeleteError(null);
                          setDeletingSlide(slide);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <TableToolbar
            addLabel={stats.length < 4 ? "Tambah Statistik" : undefined}
            onAdd={() => {
              setErrorMessage(null);
              setFieldErrors({});
              setEditingStat(null);
              setStatOpen(true);
            }}
          />

          <DataTable
            rows={stats}
            getRowKey={(r) => r.id}
            emptyTitle="Belum ada statistik"
            columns={[
              {
                key: "value",
                header: "Angka",
                cell: (row) => (
                  <span className="admin-text-modal-title text-admin-ink">
                    {row.value}
                  </span>
                ),
              },
              {
                key: "label",
                header: "Label",
                cell: (row) => (
                  <span className="text-admin-text-secondary">{row.label}</span>
                ),
              },
              {
                key: "order",
                header: "Urutan",
                cell: (row, idx) => (
                  <SortButtons
                    isFirst={idx === 0}
                    isLast={idx === stats.length - 1}
                    disabled={isPending}
                    onMove={(dir) =>
                      startTransition(async () => {
                        const res = await moveSiteStat(row.id, dir);
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
                      setEditingStat(row);
                      setStatOpen(true);
                    }}
                    onDelete={() => {
                      setDeleteError(null);
                      setDeletingStat(row);
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      )}

      <FormDialog
        open={slideOpen}
        onOpenChange={(open) => {
          setSlideOpen(open);
          if (!open) setEditingSlide(null);
        }}
        title={editingSlide ? "Ubah Slide" : "Tambah Slide"}
        size="lg"
        mode={editingSlide ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSaveSlide}
      >
        {editingSlide && (
          <input type="hidden" name="id" value={editingSlide.id} />
        )}
        <Field label="Foto Slide (3:3)" required={!editingSlide}>
          <ImageUpload
            name="image"
            currentPath={editingSlide?.image_path}
            required={!editingSlide}
            maxDimension={1920}
            cropAspect={3 / 3}
            cropAspectLabel="3:3"
          />
        </Field>
        <Field
          label="Teks Alt (untuk aksesibilitas)"
          htmlFor="slide-alt"
          required
          error={fieldErrors.alt}
        >
          <AdminInput
            id="slide-alt"
            name="alt"
            required
            maxLength={200}
            defaultValue={editingSlide?.alt ?? ""}
          />
        </Field>
        <FieldGrid>
          <Field
            label="Caption pendek"
            htmlFor="slide-caption"
            required
            error={fieldErrors.caption}
          >
            <AdminInput
              id="slide-caption"
              name="caption"
              required
              maxLength={40}
              defaultValue={editingSlide?.caption ?? ""}
            />
          </Field>
          <Field
            label="Caption panjang (tablet, opsional)"
            htmlFor="slide-caption-long"
            error={fieldErrors.caption_long}
          >
            <AdminInput
              id="slide-caption-long"
              name="caption_long"
              maxLength={80}
              defaultValue={editingSlide?.caption_long ?? ""}
            />
          </Field>
        </FieldGrid>
        <CheckboxCard
          id="slide-published"
          name="is_published"
          label="Tampilkan di situs"
          defaultChecked={editingSlide ? editingSlide.is_published : true}
        />
      </FormDialog>

      <FormDialog
        open={statOpen}
        onOpenChange={(open) => {
          setStatOpen(open);
          if (!open) setEditingStat(null);
        }}
        title={editingStat ? "Ubah Statistik" : "Tambah Statistik"}
        size="sm"
        mode={editingStat ? "edit" : "create"}
        isPending={isPending}
        errorMessage={errorMessage}
        onSubmit={handleSaveStat}
      >
        {editingStat && (
          <input type="hidden" name="id" value={editingStat.id} />
        )}
        <Field
          label="Angka"
          htmlFor="stat-value"
          required
          error={fieldErrors.value}
        >
          <AdminInput
            id="stat-value"
            name="value"
            required
            maxLength={8}
            defaultValue={editingStat?.value ?? ""}
            placeholder="Mis. 1000+"
          />
        </Field>
        <Field
          label="Label"
          htmlFor="stat-label"
          required
          error={fieldErrors.label}
        >
          <AdminInput
            id="stat-label"
            name="label"
            required
            maxLength={60}
            defaultValue={editingStat?.label ?? ""}
            placeholder="Mis. member di grup komunitas"
          />
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deletingSlide !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingSlide(null);
        }}
        title="Hapus slide ini?"
        description={deletingSlide ? `"${deletingSlide.caption}" akan dihapus.` : ""}
        onConfirm={() => {
          if (!deletingSlide) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeHeroSlide(deletingSlide.id);
            if (res.ok) {
              toast.success("Slide dihapus.");
              setDeletingSlide(null);
            } else {
              setDeleteError(res.message);
            }
          });
        }}
        loading={isPending}
        errorMessage={deleteError}
      />

      <DeleteDialog
        open={deletingStat !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingStat(null);
        }}
        title="Hapus statistik ini?"
        description={
          deletingStat
            ? `"${deletingStat.value} ${deletingStat.label}" akan dihapus.`
            : ""
        }
        onConfirm={() => {
          if (!deletingStat) return;
          setDeleteError(null);
          startTransition(async () => {
            const res = await removeSiteStat(deletingStat.id);
            if (res.ok) {
              toast.success("Statistik dihapus.");
              setDeletingStat(null);
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
