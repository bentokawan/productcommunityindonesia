"use client";

import { useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  href?: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({
  items,
  value,
  onValueChange,
  ariaLabel = "Filter kategori",
  className,
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLElement>, index: number) {
    if (!onValueChange) return;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;
    e.preventDefault();
    const target = items[nextIndex];
    if (!target) return;
    onValueChange(target.value);
    const buttons = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  }

  return (
    <div className={cn("overflow-x-auto pb-1", className)}>
      <div
        ref={listRef}
        role={onValueChange ? "tablist" : undefined}
        aria-label={ariaLabel}
        className="mx-auto flex w-max items-center gap-3"
      >
        {items.map((item, idx) => {
          const isActive = item.value === value;
          const tabClass = cn(
            "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border-[1.5px] px-5 py-3 text-tab transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) cursor-pointer select-none whitespace-nowrap",
            isActive
              ? "border-brand-500 bg-brand-500 text-ink-900 active:bg-brand-500/80"
              : "border-(--color-outline-subtle) bg-transparent text-(--color-fg) hover:bg-(--color-fg)/8 active:bg-(--color-fg)/14",
          );

          if (item.href && !onValueChange) {
            return (
              <Link
                key={item.value}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={tabClass}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onValueChange?.(item.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={tabClass}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
