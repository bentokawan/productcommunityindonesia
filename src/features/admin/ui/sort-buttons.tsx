"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

export interface SortButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  disabled?: boolean;
  onMove: (direction: "up" | "down") => void;
}

export function SortButtons({
  isFirst,
  isLast,
  disabled,
  onMove,
}: SortButtonsProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onMove("up")}
        disabled={disabled || isFirst}
        aria-label="Geser naik"
        title="Geser naik"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove("down")}
        disabled={disabled || isLast}
        aria-label="Geser turun"
        title="Geser turun"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-admin-line bg-admin-canvas text-admin-ink transition-colors hover:bg-admin-surface disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
