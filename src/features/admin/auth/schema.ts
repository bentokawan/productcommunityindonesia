import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Format email belum valid."),
  password: z.string().min(1, "Password wajib diisi."),
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Format email belum valid."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password minimal 10 karakter.")
      .max(128, "Password maksimal 128 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });
