"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { AdminSidebar } from "@/features/admin/shell/admin-sidebar";
import { PageHeader } from "@/features/admin/shell/page-header";
import { formatAuthIdentity } from "@/features/admin/auth/schema";
import { StatusChip } from "@/features/admin/ui/data-table";
import { adminFocusRing } from "@/features/admin/ui/form/controls";
import type { AdminRole } from "@/features/admin/shell/nav";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/account";
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
          {!hideSidebar && (
            <button
              type="button"
              aria-label="Buka menu navigasi"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink transition-colors hover:bg-admin-surface-muted active:scale-95 lg:hidden",
                adminFocusRing,
              )}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          <Link
            href="/admin"
            aria-label="Product Community Indonesia CMS"
            className={cn(
              "flex items-center gap-2.5 rounded-full px-1 py-1",
              adminFocusRing,
            )}
          >
            <Image
              src={
                dark ? "/logo-landing-white.png" : "/logo-landing-black.png"
              }
              alt="Product Community Indonesia"
              width={168}
              height={25}
              priority
              className="h-6 w-auto md:h-6.5"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
            title={dark ? "Tema terang" : "Tema gelap"}
            className={cn(
              "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-admin-surface text-admin-ink transition-colors hover:bg-admin-surface-muted active:scale-95",
              adminFocusRing,
            )}
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
                className={cn(
                  "inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-admin-surface pr-3 pl-1.5 admin-text-body font-medium text-admin-ink transition-colors hover:bg-admin-surface-muted active:bg-admin-surface-muted/80",
                  adminFocusRing,
                )}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-admin-ink admin-text-chip font-semibold text-admin-on-ink">
                  {getInitials(user.fullName)}
                </span>
                <span className="hidden max-w-35 truncate md:inline">
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
                className="z-50 min-w-57.5 rounded-admin-inner border border-admin-line bg-admin-canvas p-2 shadow-(--admin-shadow-pop)"
              >
                <div className="border-b border-admin-line px-3 py-2.5">
                  <p className="truncate admin-text-body font-medium text-admin-ink">
                    {user.fullName}
                  </p>
                  <p className="truncate admin-text-chip font-normal text-admin-text-secondary">
                    {formatAuthIdentity(user.email)}
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
                      className={cn(
                        "flex h-11 items-center gap-2.5 rounded-full px-3 admin-text-body text-admin-ink outline-none hover:bg-admin-surface focus:bg-admin-surface",
                        adminFocusRing,
                      )}
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex h-11 items-center gap-2.5 rounded-full px-3 admin-text-body text-admin-ink outline-none hover:bg-admin-surface focus:bg-admin-surface",
                        adminFocusRing,
                      )}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span>Lihat Situs</span>
                    </Link>
                  </DropdownMenu.Item>

                  <form action="/admin/auth/signout" method="post">
                    <button
                      type="submit"
                      className={cn(
                        "flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-full px-3 text-left admin-text-body text-admin-danger outline-none hover:bg-admin-rose-soft focus:bg-admin-rose-soft",
                        adminFocusRing,
                      )}
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
        {!hideSidebar && (
          <AdminSidebar
            role={user.role}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
        )}

        <main
          className={cn(
            "min-w-0 flex-1 px-1 py-2 md:px-4 md:py-4",
            hideSidebar && "mx-auto w-full max-w-[1120px]",
          )}
        >
          <PageHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
