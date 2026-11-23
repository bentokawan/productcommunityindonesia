import "server-only";
import { randomUUID } from "node:crypto";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export type MediaFolder = "hero" | "events" | "groups" | "team";

const MAX_BYTES = 2 * 1024 * 1024;
const MIME_TO_EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

export async function uploadImage(
  file: File,
  folder: MediaFolder,
): Promise<{ ok: true; path: string } | { ok: false; message: string }> {
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    return {
      ok: false,
      message: "Format gambar harus WebP, PNG, atau JPEG.",
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: "Ukuran gambar maksimal 2 MB.",
    };
  }

  const objectPath = `${folder}/${randomUUID()}.${ext}`;
  const supabase = await createServerAuthClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return {
      ok: false,
      message: "Gagal mengunggah gambar ke storage. Coba lagi.",
    };
  }

  return { ok: true, path: objectPath };
}

export async function removeImage(path: string | null | undefined): Promise<void> {
  if (!path || path.startsWith("placeholders/")) return;
  const supabase = await createServerAuthClient();
  await supabase.storage.from("media").remove([path]);
}
