import { z } from "zod";

export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z
    .string()
    .trim()
    .min(1, "Pertanyaan wajib diisi.")
    .max(160, "Maksimal 160 karakter."),
  answer: z
    .string()
    .trim()
    .min(1, "Jawaban wajib diisi.")
    .max(1000, "Maksimal 1000 karakter."),
  is_published: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
});

export type FaqInput = z.infer<typeof faqSchema>;
