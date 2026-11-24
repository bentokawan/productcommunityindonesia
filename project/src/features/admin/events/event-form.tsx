"use client";

import { useState, useTransition } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { ImageUpload } from "@/features/admin/ui/image-upload";
import { Field, FieldGrid, FormPage, FormSection } from "@/features/admin/ui/form/fields";
import {
  AdminInput,
  AdminSelect,
  CheckboxCard,
} from "@/features/admin/ui/form/controls";
import { isoToWibLocal } from "@/features/admin/events/schema";
import { saveEvent } from "@/features/admin/events/actions";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export function EventForm({
  event,
  categories,
}: {
  event: Tables<"events"> | null;
  categories: Tables<"event_categories">[];
}) {
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(event));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveEvent(formData);
      if (res && !res.ok) {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  return (
    <FormPage
      backHref="/admin/events"
      cancelHref="/admin/events"
      title={event ? `Ubah ${event.edition_label}` : "Tambah Webinar"}
      subtitle="Jadwal disimpan dalam zona waktu WIB (Asia/Jakarta)."
      width="single"
      isPending={isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
    >
      {event && <input type="hidden" name="id" value={event.id} />}

      <FormSection step={1} title="Info webinar">
        <FieldGrid>
          <Field
            label="Kategori"
            htmlFor="ev-cat"
            required
            error={fieldErrors.category_id}
          >
            <AdminSelect
              id="ev-cat"
              name="category_id"
              required
              defaultValue={event?.category_id ?? categories[0]?.id ?? ""}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </AdminSelect>
          </Field>

          <Field
            label="Label edisi"
            htmlFor="ev-edition"
            required
            error={fieldErrors.edition_label}
          >
            <AdminInput
              id="ev-edition"
              name="edition_label"
              required
              maxLength={40}
              defaultValue={event?.edition_label ?? ""}
              placeholder="Mis. #SharingSession8"
            />
          </Field>
        </FieldGrid>

        <Field label="Judul webinar" htmlFor="ev-title" required error={fieldErrors.title}>
          <AdminInput
            id="ev-title"
            name="title"
            required
            maxLength={140}
            defaultValue={event?.title ?? ""}
            onChange={(e) => {
              if (!slugEdited) {
                setSlug(toSlug(e.target.value));
              }
            }}
          />
        </Field>

        <Field
          label="Slug URL"
          htmlFor="ev-slug"
          required
          hint="Otomatis dari judul, bisa disesuaikan."
          error={fieldErrors.slug}
        >
          <AdminInput
            id="ev-slug"
            name="slug"
            required
            maxLength={120}
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value);
            }}
          />
        </Field>

        <FieldGrid>
          <Field
            label="Pembicara"
            htmlFor="ev-speakers"
            required
            error={fieldErrors.speakers}
          >
            <AdminInput
              id="ev-speakers"
              name="speakers"
              required
              maxLength={200}
              defaultValue={event?.speakers ?? ""}
              placeholder="Nama · Peran, Perusahaan"
            />
          </Field>

          <Field
            label="Jadwal mulai (WIB)"
            htmlFor="ev-starts"
            required
            error={fieldErrors.starts_at_local}
          >
            <AdminInput
              id="ev-starts"
              name="starts_at_local"
              type="datetime-local"
              required
              defaultValue={
                event ? isoToWibLocal(event.starts_at) : ""
              }
            />
          </Field>
        </FieldGrid>
      </FormSection>

      <FormSection step={2} title="Poster & tautan">
        <Field label="Poster Webinar (1:1)" required={!event}>
          <ImageUpload
            name="poster"
            currentPath={event?.poster_path}
            required={!event}
            maxDimension={1200}
            cropAspect={1}
            cropAspectLabel="1:1"
          />
        </Field>

        <Field
          label="URL Post Instagram"
          htmlFor="ev-ig"
          required
          hint="Harus diawali https://www.instagram.com/"
          error={fieldErrors.instagram_url}
        >
          <AdminInput
            id="ev-ig"
            name="instagram_url"
            type="url"
            required
            defaultValue={
              event?.instagram_url ?? "https://www.instagram.com/productcommunityid/"
            }
          />
        </Field>

        <CheckboxCard
          id="ev-pub"
          name="is_published"
          label="Tampilkan di situs"
          description="Nonaktifkan jika webinar ini masih berupa draf."
          defaultChecked={event ? event.is_published : true}
        />
      </FormSection>
    </FormPage>
  );
}
