"use client";

import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { adminFieldClass, adminFocusRing } from "@/features/admin/ui/styles";

export { adminFieldClass, adminFocusRing };

export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(adminFieldClass, className)} {...props} />;
}

export function AdminTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        adminFieldClass,
        "h-auto min-h-26 rounded-admin-textarea py-3.5",
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
    <select className={cn(adminFieldClass, className)} {...props}>
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
        "flex cursor-pointer items-start gap-3 rounded-admin-textarea border border-admin-line bg-admin-mint-soft/45 px-4 py-3.5 transition-colors hover:border-admin-line-strong hover:bg-admin-mint-soft/70 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-admin-ink",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded accent-admin-ink outline-none"
        {...props}
      />
      <span className="min-w-0">
        <span className="block admin-text-body font-medium text-admin-ink">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block admin-text-chip font-normal text-admin-text-secondary">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
