"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createBrowserAuthClient } from "@/lib/supabase/browser-auth";
import { Field, FormPage, FormSection } from "@/features/admin/ui/form/fields";
import { AdminInput } from "@/features/admin/ui/form/controls";
import {
  updateMyName,
  updateMyPassword,
} from "@/features/admin/account/actions";

export function AccountForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [nameError, setNameError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>(
    {},
  );
  const [isPending, startTransition] = useTransition();
  const [linkingGoogle, setLinkingGoogle] = useState(false);

  function handleNameSubmit(formData: FormData) {
    setNameError(null);
    startTransition(async () => {
      const res = await updateMyName(formData);
      if (res.ok) {
        toast.success("Nama tampilan diperbarui.");
      } else {
        setNameError(res.message);
      }
    });
  }

  function handlePasswordSubmit(formData: FormData) {
    setPwError(null);
    setPwFieldErrors({});
    startTransition(async () => {
      const res = await updateMyPassword(formData);
      if (res.ok) {
        toast.success("Password berhasil diperbarui.");
      } else {
        setPwError(res.message);
        if (res.fieldErrors) setPwFieldErrors(res.fieldErrors);
      }
    });
  }

  async function handleLinkGoogle() {
    setLinkingGoogle(true);
    const supabase = createBrowserAuthClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/auth/callback?next=/admin/account`,
      },
    });
    if (error) {
      toast.error("Gagal menghubungkan akun Google.");
      setLinkingGoogle(false);
    }
  }

  return (
    <div className="space-y-8">
      <FormPage
        width="single"
        isPending={isPending}
        errorMessage={nameError}
        submitLabel="Simpan Nama"
        onSubmit={handleNameSubmit}
      >
        <FormSection step={1} title="Profil saya">
          <Field label="Email" htmlFor="acc-email">
            <AdminInput id="acc-email" value={email} disabled />
          </Field>
          <Field label="Nama lengkap" htmlFor="acc-name" required>
            <AdminInput
              id="acc-name"
              name="full_name"
              required
              maxLength={80}
              defaultValue={fullName}
            />
          </Field>
        </FormSection>
      </FormPage>

      <FormPage
        width="single"
        isPending={isPending}
        errorMessage={pwError}
        submitLabel="Ubah Password"
        onSubmit={handlePasswordSubmit}
      >
        <FormSection step={2} title="Keamanan & Google">
          <Field
            label="Password baru"
            htmlFor="acc-pw"
            required
            error={pwFieldErrors.password}
          >
            <AdminInput
              id="acc-pw"
              name="password"
              type="password"
              required
              minLength={10}
              placeholder="Minimal 10 karakter"
            />
          </Field>
          <Field
            label="Ulangi password baru"
            htmlFor="acc-pw-confirm"
            required
            error={pwFieldErrors.confirmPassword}
          >
            <AdminInput
              id="acc-pw-confirm"
              name="confirmPassword"
              type="password"
              required
              minLength={10}
            />
          </Field>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleLinkGoogle}
              disabled={linkingGoogle}
              className="inline-flex h-11 cursor-pointer items-center rounded-full border border-admin-line-strong bg-admin-canvas px-5 text-[14px] font-medium text-admin-ink hover:bg-admin-surface disabled:opacity-50"
            >
              {linkingGoogle ? "Menghubungkan…" : "Hubungkan akun Google"}
            </button>
          </div>
        </FormSection>
      </FormPage>
    </div>
  );
}
