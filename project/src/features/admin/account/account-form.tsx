"use client";

import { useMemo, useState, useTransition, type KeyboardEvent } from "react";
import {
  Globe,
  KeyRound,
  Link2,
  Save,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { SiteLinks } from "@/content/fallback-links";
import type { Tables } from "@/lib/supabase/database.types";
import { createBrowserAuthClient } from "@/lib/supabase/browser-auth";
import type { AdminRole } from "@/features/admin/shell/nav";
import { formatAuthIdentity } from "@/features/admin/auth/schema";
import { StatusChip } from "@/features/admin/ui/data-table";
import { Field } from "@/features/admin/ui/form/fields";
import { AdminInput } from "@/features/admin/ui/form/controls";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { UsersManager } from "@/features/admin/users/users-manager";
import { cn } from "@/lib/utils";
import {
  updateMyName,
  updateMyPassword,
} from "@/features/admin/account/actions";

export type AccountTabId = "profile" | "security" | "google" | "links" | "users";

interface AccountTab {
  id: AccountTabId;
  label: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const ALL_ACCOUNT_TABS: AccountTab[] = [
  {
    id: "profile",
    label: "Info Akun",
    shortDescription: "Nama tampilan, email, dan peran",
    description: "Informasi profil akun yang tampil di CMS.",
    icon: User,
  },
  {
    id: "security",
    label: "Keamanan",
    shortDescription: "Ganti password untuk keamanan akun",
    description: "Perbarui password agar akses CMS kamu tetap aman.",
    icon: KeyRound,
  },
  {
    id: "google",
    label: "Koneksi Google",
    shortDescription: "Masuk lebih cepat dengan akun Google",
    description: "Hubungkan akun Google untuk login tanpa mengetik password.",
    icon: Globe,
  },
  {
    id: "links",
    label: "Link & Sosial Media",
    shortDescription: "WhatsApp, Instagram, dan LinkedIn",
    description: "Link WhatsApp, Instagram, dan LinkedIn di seluruh situs.",
    icon: Link2,
    adminOnly: true,
  },
  {
    id: "users",
    label: "Pengguna",
    shortDescription: "Undang pengurus dan atur role CMS",
    description: "Undang pengurus baru dan atur role admin atau editor.",
    icon: Shield,
    adminOnly: true,
  },
];

export function AccountForm({
  userId,
  fullName,
  email,
  role,
  googleLinked,
  googleEmail,
  siteLinks,
  profiles,
  initialTab = "profile",
}: {
  userId: string;
  fullName: string;
  email: string;
  role: AdminRole;
  googleLinked: boolean;
  googleEmail: string | null;
  siteLinks?: SiteLinks;
  profiles?: Tables<"profiles">[];
  initialTab?: AccountTabId;
}) {
  const tabs = useMemo(
    () => ALL_ACCOUNT_TABS.filter((tab) => !tab.adminOnly || role === "admin"),
    [role],
  );
  const [activeTab, setActiveTab] = useState<AccountTabId>(initialTab);
  const [nameError, setNameError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>(
    {},
  );
  const [pwFormKey, setPwFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [linkingGoogle, setLinkingGoogle] = useState(false);

  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]!;
  const CurrentIcon = currentTab.icon;

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    setActiveTab(nextTab.id);
    document.getElementById(`account-tab-${nextTab.id}`)?.focus();
  }

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
        setPwFormKey((prev) => prev + 1);
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
    <div className="border-t border-admin-line pt-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[276px_minmax(0,1fr)] lg:items-start">
        <div
          role="tablist"
          aria-label="Bagian pengaturan"
          aria-orientation="vertical"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                id={`account-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`account-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3.5 rounded-admin-inner border px-3.5 py-3 text-left transition-colors",
                  adminFocusRing,
                  isActive
                    ? "border-admin-line bg-admin-canvas"
                    : "border-transparent bg-transparent hover:bg-admin-surface",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    isActive
                      ? "bg-admin-ink text-admin-on-ink"
                      : "text-admin-text-secondary",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate admin-text-body text-admin-ink",
                      isActive ? "font-semibold" : "font-medium",
                    )}
                  >
                    {tab.label}
                  </span>
                  <span className="mt-0.5 block truncate admin-text-chip font-normal text-admin-text-secondary">
                    {tab.shortDescription}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <section
          id={`account-panel-${currentTab.id}`}
          role="tabpanel"
          aria-labelledby={`account-tab-${currentTab.id}`}
          className="rounded-admin-card border border-admin-line bg-admin-canvas p-5 sm:p-7 md:p-8"
        >
          <div className="flex items-center gap-3.5 border-b border-admin-line pb-5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink">
              <CurrentIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="admin-text-card-title text-admin-ink">
                {currentTab.label}
              </h2>
              <p className="admin-text-meta text-admin-text-secondary">
                {currentTab.description}
              </p>
            </div>
          </div>

          {activeTab === "users" && profiles ? (
            <div className="mt-6">
              <UsersManager initialRows={profiles} currentUserId={userId} />
            </div>
          ) : (
            <div className="mt-6 rounded-admin-inner border border-admin-line bg-admin-canvas p-5 md:p-7">
              {activeTab === "profile" && (
                <form action={handleNameSubmit} className="space-y-5">
                  {nameError && (
                    <div
                      role="alert"
                      className="rounded-admin-textarea bg-admin-rose-soft px-4 py-3 admin-text-body text-admin-rose-ink"
                    >
                      {nameError}
                    </div>
                  )}

                  <Field label="Email / Username" htmlFor="acc-email">
                    <AdminInput
                      id="acc-email"
                      value={formatAuthIdentity(email)}
                      disabled
                      className="disabled:border-transparent disabled:bg-admin-surface disabled:text-admin-text-secondary"
                    />
                  </Field>

                  <Field label="Role" htmlFor="acc-role">
                    <AdminInput
                      id="acc-role"
                      value={role === "admin" ? "Admin" : "Editor"}
                      disabled
                      className="disabled:border-transparent disabled:bg-admin-surface disabled:text-admin-text-secondary"
                    />
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
                      <span>
                        {isPending ? "Menyimpan…" : "Simpan Perubahan"}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form
                  key={pwFormKey}
                  action={handlePasswordSubmit}
                  className="space-y-5"
                >
                  {pwError && (
                    <div
                      role="alert"
                      className="rounded-admin-textarea bg-admin-rose-soft px-4 py-3 admin-text-body text-admin-rose-ink"
                    >
                      {pwError}
                    </div>
                  )}

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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
                      placeholder="Ketik ulang password baru"
                    />
                  </Field>

                  <p className="admin-text-chip font-normal text-admin-text-secondary">
                    Gunakan password yang kuat dan jangan bagikan ke orang lain.
                  </p>

                  <div className="flex justify-end border-t border-admin-line pt-5">
                    <button
                      type="submit"
                      disabled={isPending}
                      className={cn(
                        "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
                        adminFocusRing,
                      )}
                    >
                      <KeyRound className="h-4 w-4" aria-hidden="true" />
                      <span>{isPending ? "Menyimpan…" : "Ganti Password"}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "google" && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <p className="admin-text-body font-semibold text-admin-ink">
                          Akun Google
                        </p>
                        <StatusChip tone={googleLinked ? "mint" : "neutral"}>
                          {googleLinked ? "Terhubung" : "Belum terhubung"}
                        </StatusChip>
                      </div>
                      <p className="admin-text-meta text-admin-text-secondary">
                        {googleLinked
                          ? `Terhubung dengan ${googleEmail ?? email}. Kamu bisa masuk langsung lewat tombol Masuk dengan Google.`
                          : "Hubungkan akun Google agar kamu bisa masuk ke CMS lebih cepat tanpa mengetik password."}
                      </p>
                    </div>

                    {!googleLinked && (
                      <button
                        type="button"
                        onClick={handleLinkGoogle}
                        disabled={linkingGoogle}
                        className={cn(
                          "inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90 disabled:opacity-50",
                          adminFocusRing,
                        )}
                      >
                        <Globe className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {linkingGoogle
                            ? "Menghubungkan…"
                            : "Hubungkan akun Google"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "links" && siteLinks && (
                <SettingsForm links={siteLinks} embedded />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
