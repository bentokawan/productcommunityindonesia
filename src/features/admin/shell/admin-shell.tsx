"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { AdminSidebar } from "@/features/admin/shell/admin-sidebar";
import { PageHeader } from "@/features/admin/shell/page-header";
import { StatusChip } from "@/features/admin/ui/data-table";
import type { AdminRole } from "@/features/admin/shell/nav";

export interface AdminShellProps {
  user: {
    fullName: string;
    email: string;
    role: AdminRole;
  };
  children: ReactNode;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return (parts[0]?.[0] ?? "P").toUpperCase();
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

const THEME_KEY = "pci-admin-theme";
const THEME_EVENT = "pci-admin-theme-change";

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getThemeSnapshot(): boolean {
  return window.localStorage.getItem(THEME_KEY) === "dark";
}

function getThemeServerSnapshot(): boolean {
  return false;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    document.querySelector(".admin-shell")?.classList.toggle("dark", dark);
  }, [dark]);

  function toggleTheme() {
    window.localStorage.setItem(THEME_KEY, dark ? "light" : "dark");
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <div className="min-h-screen bg-admin-canvas text-admin-ink">
      <header className="sticky top-0 z-40 flex h-18 items-center justify-between border-b border-admin-line bg-admin-canvas px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Buka menu navigasi"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link href="/admin" className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0B0B0B] text-white">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                aria-hidden="true"
              >
                <rect width="24" height="24" rx="7" fill="#02D6A6" />
                <path
                  d="M8 17V7H12.5C14.7 7 16.5 8.8 16.5 11C16.5 13.2 14.7 15 12.5 15H10.5V17H8ZM10.5 12.5H12.3C13.2 12.5 14 11.8 14 11C14 10.2 13.2 9.5 12.3 9.5H10.5V12.5Z"
                  fill="#1A1A19"
                />
              </svg>
            </span>
            <span className="text-[15px] font-medium text-admin-ink">
              PCI CMS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
            title={dark ? "Tema terang" : "Tema gelap"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink transition-colors hover:bg-admin-surface-muted"
          >
            {dark ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-admin-surface pr-3 pl-1.5 text-[14px] font-medium text-admin-ink transition-colors hover:bg-admin-surface-muted"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-admin-ink text-[12px] font-semibold text-admin-on-ink">
                  {getInitials(user.fullName)}
                </span>
                <span className="hidden max-w-[140px] truncate md:inline">
                  {user.fullName}
                </span>
                <ChevronDown
                  className="hidden h-4 w-4 text-admin-text-secondary md:inline"
                  aria-hidden="true"
                />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 min-w-[230px] rounded-[24px] border border-admin-line bg-admin-canvas p-2 shadow-(--admin-shadow-pop)"
              >
                <div className="border-b border-admin-line px-3 py-2.5">
                  <p className="truncate text-[14px] font-medium text-admin-ink">
                    {user.fullName}
                  </p>
                  <p className="truncate text-[12px] text-admin-text-secondary">
                    {user.email}
                  </p>
                  <StatusChip
                    tone={user.role === "admin" ? "mint" : "lilac"}
                    className="mt-2"
                  >
                    {user.role === "admin" ? "Admin" : "Editor"}
                  </StatusChip>
                </div>

                <div className="mt-1 space-y-0.5">
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/admin/account"
                      className="flex h-11 items-center gap-2.5 rounded-full px-3 text-[14px] text-admin-ink outline-none hover:bg-admin-surface"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      <span>Akun Saya</span>
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center gap-2.5 rounded-full px-3 text-[14px] text-admin-ink outline-none hover:bg-admin-surface"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span>Lihat Situs</span>
                    </Link>
                  </DropdownMenu.Item>

                  <form action="/admin/auth/signout" method="post">
                    <button
                      type="submit"
                      className="flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-full px-3 text-left text-[14px] text-admin-danger outline-none hover:bg-admin-rose-soft"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      <span>Keluar</span>
                    </button>
                  </form>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      <div className="flex gap-6 p-3 md:gap-8 md:p-6">
        <AdminSidebar
          role={user.role}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="min-w-0 flex-1 px-1 py-2 md:px-4 md:py-4">
          <PageHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
