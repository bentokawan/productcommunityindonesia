"use client";

import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-full border border-admin-line bg-admin-surface px-4.5 text-[16px] text-admin-ink placeholder:text-admin-text-faint focus:border-admin-ink focus:bg-admin-canvas focus:outline-none disabled:opacity-50 md:text-[14px]",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[104px] w-full rounded-[20px] border border-admin-line bg-admin-surface px-4.5 py-3.5 text-[16px] text-admin-ink placeholder:text-admin-text-faint focus:border-admin-ink focus:bg-admin-canvas focus:outline-none disabled:opacity-50 md:text-[14px]",
        className,
      )}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-full border border-admin-line bg-admin-surface px-4.5 text-[16px] text-admin-ink focus:border-admin-ink focus:bg-admin-canvas focus:outline-none disabled:opacity-50 md:text-[14px]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export interface CheckboxCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export function CheckboxCard({
  label,
  description,
  className,
  id,
  ...props
}: CheckboxCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[20px] border border-admin-line bg-admin-mint-soft/45 px-4 py-3.5 transition-colors hover:bg-admin-mint-soft/70",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded accent-admin-ink"
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-admin-ink">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-[12px] text-admin-text-secondary">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
