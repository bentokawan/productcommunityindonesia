import { z } from "zod";

export const siteStatSchema = z.object({
  id: z.string().uuid().optional(),
  value: z
    .string()
    .trim()
    .min(1, "Angka wajib diisi.")
    .max(8, "Maksimal 8 karakter."),
  label: z
    .string()
    .trim()
    .min(1, "Label wajib diisi.")
    .max(60, "Maksimal 60 karakter."),
});

export const heroSlideSchema = z.object({
  id: z.string().uuid().optional(),
  alt: z
    .string()
    .trim()
    .min(1, "Teks alt wajib diisi.")
    .max(200, "Maksimal 200 karakter."),
  caption: z
    .string()
    .trim()
    .min(1, "Caption pendek wajib diisi.")
    .max(40, "Maksimal 40 karakter."),
  caption_long: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.string().trim().max(80, "Maksimal 80 karakter.").nullable(),
  ),
  is_published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});

export const communityGroupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Nama grup wajib diisi.")
    .max(60, "Maksimal 60 karakter."),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi wajib diisi.")
    .max(200, "Maksimal 200 karakter."),
});

export const teamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(60, "Maksimal 60 karakter."),
  role: z
    .string()
    .trim()
    .min(1, "Peran wajib diisi.")
    .max(60, "Maksimal 60 karakter."),
  linkedin_url: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z
      .string()
      .trim()
      .regex(/^https:\/\//, "URL harus diawali https://.")
      .nullable(),
  ),
  is_published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});
