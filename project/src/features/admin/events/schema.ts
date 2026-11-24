import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Judul webinar wajib diisi.")
    .max(140, "Maksimal 140 karakter."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(120, "Maksimal 120 karakter.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    ),
  category_id: z.string().uuid("Pilih kategori webinar."),
  edition_label: z
    .string()
    .trim()
    .min(1, "Label edisi wajib diisi.")
    .max(40, "Maksimal 40 karakter."),
  speakers: z
    .string()
    .trim()
    .min(1, "Nama pembicara wajib diisi.")
    .max(200, "Maksimal 200 karakter."),
  starts_at_local: z
    .string()
    .trim()
    .min(1, "Jadwal mulai wajib diisi."),
  instagram_url: z
    .string()
    .trim()
    .max(500, "Maksimal 500 karakter.")
    .refine(
      (v) => v.startsWith("https://www.instagram.com/"),
      "URL harus diawali https://www.instagram.com/",
    ),
  is_published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});

export function wibLocalToIso(localValue: string): string {
  // Input format from <input type="datetime-local">: "YYYY-MM-DDTHH:mm"
  const normalized =
    localValue.length === 16 ? `${localValue}:00+07:00` : `${localValue}+07:00`;
  return new Date(normalized).toISOString();
}

export function isoToWibLocal(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
