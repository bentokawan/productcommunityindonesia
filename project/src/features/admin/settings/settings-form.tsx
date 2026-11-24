"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { SiteLinks } from "@/content/fallback-links";
import { Field, FieldGrid, FormPage, FormSection } from "@/features/admin/ui/form/fields";
import { AdminInput } from "@/features/admin/ui/form/controls";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";
import { saveSiteLinks } from "@/features/admin/settings/actions";

export function SettingsForm({
  links,
  embedded = false,
}: {
  links: SiteLinks;
  embedded?: boolean;
}) {
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

  const fields = (
    <>
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
    </>
  );

  if (embedded) {
    return (
      <form action={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-admin-textarea bg-admin-rose-soft px-4 py-3 admin-text-body text-admin-rose-ink"
          >
            {errorMessage}
          </div>
        )}

        {fields}

        <div className="flex justify-end border-t border-admin-line pt-5">
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
              adminFocusRing,
            )}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{isPending ? "Menyimpan…" : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    );
  }

  return (
    <FormPage
      width="single"
      isPending={isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
    >
      <FormSection step={1} title="Link & sosial media">
        {fields}
      </FormSection>
    </FormPage>
  );
}
