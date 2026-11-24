"use client";

import type { ReactNode } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminFieldClass,
  adminFocusRing,
} from "@/features/admin/ui/form/controls";

export interface TableToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  addLabel?: string;
  onAdd?: () => void;
  addHref?: string;
}

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Cari…",
  filters,
  addLabel,
  onAdd,
  addHref,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-70">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-admin-text-faint"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className={cn(adminFieldClass, "pr-4 pl-10")}
            />
          </div>
        )}
        {filters}
      </div>

      {addLabel && (onAdd || addHref) && (
        <div className="shrink-0">
          {addHref ? (
            <a
              href={addHref}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90",
                adminFocusRing,
              )}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{addLabel}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className={cn(
                "inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-admin-ink px-6 admin-text-nav font-medium text-admin-on-ink transition-colors hover:bg-admin-ink-soft active:opacity-90",
                adminFocusRing,
              )}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
