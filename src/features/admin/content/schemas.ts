import { z } from "zod";

export const activitySchema = z.object({
  id: z.string().uuid().optional(),
  emoji: z
    .string()
    .trim()
    .min(1, "Emoji wajib diisi.")
    .max(8, "Maksimal 8 karakter."),
  title: z
    .string()
    .trim()
    .min(1, "Judul wajib diisi.")
    .max(60, "Maksimal 60 karakter."),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi wajib diisi.")
    .max(200, "Maksimal 200 karakter."),
});

export const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Nama partner wajib diisi.")
    .max(60, "Maksimal 60 karakter."),
  url: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z
      .string()
      .trim()
      .regex(/^https:\/\//, "URL harus diawali https://.")
      .nullable(),
  ),
});

export const eventCategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Nama kategori wajib diisi.")
    .max(40, "Maksimal 40 karakter."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(40, "Maksimal 40 karakter.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    ),
});
