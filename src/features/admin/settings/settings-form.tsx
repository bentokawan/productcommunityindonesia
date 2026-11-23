"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { SiteLinks } from "@/content/fallback-links";
import { Field, FieldGrid, FormPage, FormSection } from "@/features/admin/ui/form/fields";
import { AdminInput } from "@/features/admin/ui/form/controls";
import { saveSiteLinks } from "@/features/admin/settings/actions";

export function SettingsForm({ links }: { links: SiteLinks }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await saveSiteLinks(formData);
      if (res.ok) {
        toast.success("Link & sosial media disimpan.");
      } else {
        setErrorMessage(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  }

  return (
    <FormPage
      width="single"
      isPending={isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
    >
      <FormSection step={1} title="Komunitas">
        <Field
          label="URL Grup WhatsApp"
          htmlFor="st-wa"
          required
          hint='Dipakai tombol "Gabung Grup WhatsApp" di hero, CTA, dan menu.'
          error={fieldErrors.whatsapp_url}
        >
          <AdminInput
            id="st-wa"
            name="whatsapp_url"
            type="url"
            required
            defaultValue={links.whatsappUrl}
            placeholder="https://chat.whatsapp.com/..."
          />
        </Field>
      </FormSection>

      <FormSection step={2} title="Sosial media">
        <FieldGrid>
          <Field
            label="URL Instagram"
            htmlFor="st-ig-url"
            required
            error={fieldErrors.instagram_url}
          >
            <AdminInput
              id="st-ig-url"
              name="instagram_url"
              type="url"
              required
              defaultValue={links.instagramUrl}
            />
          </Field>

          <Field
            label="Handle Instagram"
            htmlFor="st-ig-handle"
            required
            error={fieldErrors.instagram_handle}
          >
            <AdminInput
              id="st-ig-handle"
              name="instagram_handle"
              required
              defaultValue={links.instagramHandle}
              placeholder="@productcommunityid"
            />
          </Field>
        </FieldGrid>

        <Field
          label="URL LinkedIn"
          htmlFor="st-li"
          required
          error={fieldErrors.linkedin_url}
        >
          <AdminInput
            id="st-li"
            name="linkedin_url"
            type="url"
            required
            defaultValue={links.linkedinUrl}
          />
        </Field>
      </FormSection>
    </FormPage>
  );
}
