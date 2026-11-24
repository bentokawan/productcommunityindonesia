import "server-only";
import { randomUUID } from "node:crypto";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import {
  detectImageMimeFromBytes,
  isRemovableStoragePath,
  type SupportedImageMime,
} from "@/features/admin/ui/image-utils";

export type MediaFolder = "hero" | "events" | "groups" | "team";

const MAX_BYTES = 2 * 1024 * 1024;
const MIME_TO_EXT: Record<SupportedImageMime, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

export async function uploadImage(
  file: File,
  folder: MediaFolder,
): Promise<{ ok: true; path: string } | { ok: false; message: string }> {
  if (file.size <= 0) {
    return { ok: false, message: "Berkas gambar kosong." };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: "Ukuran gambar maksimal 2 MB.",
    };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const detectedMime = detectImageMimeFromBytes(buffer);
  if (!detectedMime) {
    return {
      ok: false,
      message: "Format gambar harus WebP, PNG, atau JPEG yang valid.",
    };
  }

  const ext = MIME_TO_EXT[detectedMime];
  const objectPath = `${folder}/${randomUUID()}.${ext}`;
  const supabase = await createServerAuthClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(objectPath, buffer, {
      contentType: detectedMime,
      upsert: false,
    });

  if (error) {
    console.error("[storage] failed to upload object", {
      folder,
      message: error.message,
    });
    return {
      ok: false,
      message: "Gagal mengunggah gambar ke storage. Coba lagi.",
    };
  }

  return { ok: true, path: objectPath };
}

export async function removeImage(
  path: string | null | undefined,
): Promise<void> {
  if (!isRemovableStoragePath(path)) return;
  const supabase = await createServerAuthClient();
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) {
    console.error("[storage] failed to remove object", {
      path,
      message: error.message,
    });
  }
}
