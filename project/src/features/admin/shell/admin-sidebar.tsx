"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronDown,
  Compass,
  Handshake,
  HelpCircle,
  Home,
  IdCard,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
  Tag,
  Users,
  Video,
  X,
} from "lucide-react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";
import { adminFocusRing } from "@/features/admin/ui/form/controls";
import {
  filterNavGroups,
  type AdminRole,
  type NavIcon,
} from "@/features/admin/shell/nav";

const ICONS: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  home: Home,
  image: ImageIcon,
  handshake: Handshake,
  compass: Compass,
  users: Users,
  "id-card": IdCard,
  help: HelpCircle,
  video: Video,
  tag: Tag,
  settings: Settings,
  link: Link2,
  shield: Shield,
  activity: Activity,
};

export interface AdminSidebarProps {
  role: AdminRole;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  role,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const groups = filterNavGroups(role);
  const [compact, setCompact] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    beranda: true,
    webinar: true,
    pengaturan: true,
  }));

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function renderNavContent(isMobileDrawer: boolean) {
    const showLabels = isMobileDrawer || !compact;

    return (
      <nav aria-label="Navigasi CMS" className="flex flex-1 flex-col gap-4">
        {groups.map((group) => {
          const GroupIcon = ICONS[group.icon];

          if (group.modules.length === 0) {
            const active = pathname === group.href;
            return (
              <Link
                key={group.id}
                href={group.href}
                onClick={isMobileDrawer ? onMobileClose : undefined}
                aria-current={active ? "page" : undefined}
                aria-label={!showLabels ? group.label : undefined}
                title={!showLabels ? group.label : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-full px-3.5 admin-text-nav transition-colors",
                  adminFocusRing,
                  active
                    ? "bg-admin-ink font-medium text-admin-on-ink"
                    : "text-admin-ink hover:bg-admin-surface-muted active:bg-admin-surface-muted/80",
                  !showLabels && "justify-center px-0",
                )}
              >
                <GroupIcon className="h-4.5 w-4.5 shrink-0" />
                {showLabels && <span>{group.label}</span>}
              </Link>
            );
          }

          const hasActiveModule = group.modules.some(
            (m) => pathname === m.href || pathname.startsWith(`${m.href}/`),
          );
          const isOpen = hasActiveModule || (openGroups[group.id] ?? true);

          return (
            <div key={group.id} className="space-y-1">
              {showLabels && (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-full px-3.5 py-1.5 admin-text-chip text-admin-text-secondary transition-colors hover:text-admin-ink",
                    adminFocusRing,
                  )}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen ? "rotate-0" : "-rotate-90",
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}

              {(isOpen || !showLabels) && (
                <ul className="space-y-0.5">
                  {group.modules.map((mod) => {
                    const ModIcon = ICONS[mod.icon];
                    const active =
                      pathname === mod.href ||
                      pathname.startsWith(`${mod.href}/`);
                    return (
                      <li key={mod.href}>
                        <Link
                          href={mod.href}
                          onClick={isMobileDrawer ? onMobileClose : undefined}
                          aria-current={active ? "page" : undefined}
                          aria-label={!showLabels ? mod.label : undefined}
                          title={!showLabels ? mod.label : undefined}
                          className={cn(
                            "flex h-11 items-center gap-3 rounded-full px-3.5 admin-text-nav transition-colors",
                            adminFocusRing,
                            active
                              ? "bg-admin-ink font-medium text-admin-on-ink"
                              : "text-admin-ink hover:bg-admin-surface-muted active:bg-admin-surface-muted/80",
                            !showLabels && "justify-center px-0",
                          )}
                        >
                          <ModIcon className="h-4.5 w-4.5 shrink-0" />
                          {showLabels && <span>{mod.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {!isMobileDrawer && (
          <div className="mt-auto hidden pt-4 lg:flex xl:hidden">
            <button
              type="button"
              onClick={() => setCompact((v) => !v)}
              aria-label={compact ? "Lebarkan sidebar" : "Ringkaskan sidebar"}
              className={cn(
                "flex h-10 w-full cursor-pointer items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-text-secondary transition-colors hover:text-admin-ink active:bg-admin-surface-muted",
                adminFocusRing,
              )}
            >
              {compact ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </nav>
    );
  }

  return (
    <>
      <aside
        className={cn(
          "sticky top-[84px] hidden h-[calc(100vh-96px)] shrink-0 flex-col overflow-y-auto rounded-admin-card bg-admin-surface p-4 lg:flex",
          compact ? "w-[80px]" : "w-[264px]",
        )}
      >
        {renderNavContent(false)}
      </aside>

      <Dialog.Root
        open={mobileOpen}
        onOpenChange={(open) => {
          if (!open) onMobileClose();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 lg:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto bg-admin-surface p-5 shadow-(--admin-shadow-overlay) focus:outline-none lg:hidden"
          >
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="admin-text-nav font-medium text-admin-ink">
                Menu CMS
              </Dialog.Title>
              <Dialog.Close
                aria-label="Tutup menu"
                className={cn(
                  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface-muted active:scale-95",
                  adminFocusRing,
                )}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </div>
            {renderNavContent(true)}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
