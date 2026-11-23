"use client";

import { useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { publicUrl } from "@/lib/supabase/storage";

export interface ImageUploadProps {
  name: string;
  currentPath?: string | null;
  required?: boolean;
  hint?: string;
  aspectClass?: string;
}

const ALLOWED_TYPES = new Set(["image/webp", "image/png", "image/jpeg"]);
const MAX_BYTES = 2 * 1024 * 1024;

export function ImageUpload({
  name,
  currentPath,
  required,
  hint = "WebP, PNG, atau JPEG maksimal 2 MB.",
  aspectClass = "aspect-square w-36",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
    currentPath ? publicUrl(currentPath) : null,
  );
  const [localError, setLocalError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setLocalError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setLocalError("Format harus WebP, PNG, atau JPEG.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("Ukuran gambar maksimal 2 MB.");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-4">
        {previewUrl && (
          <div
            className={`relative overflow-hidden rounded-[20px] border border-admin-line bg-admin-surface ${aspectClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Pratinjau gambar"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label="Hapus pratinjau"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-admin-ink/80 text-admin-on-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <label className="inline-flex h-28 min-w-[200px] flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[24px] border border-dashed border-admin-line-strong bg-admin-surface/60 px-4 text-center transition-colors hover:bg-admin-surface">
          <ImagePlus
            className="h-5 w-5 text-admin-text-secondary"
            aria-hidden="true"
          />
          <span className="text-[13px] font-medium text-admin-ink">
            {previewUrl ? "Ganti gambar" : "Pilih gambar"}
          </span>
          <span className="text-[12px] text-admin-text-secondary">{hint}</span>
          <input
            type="file"
            name={name}
            accept="image/webp,image/png,image/jpeg"
            required={required && !currentPath}
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      </div>

      {localError && (
        <p className="text-[12px] text-admin-danger">{localError}</p>
      )}
    </div>
  );
}
