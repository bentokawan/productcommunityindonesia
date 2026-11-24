import { z } from "zod";

export const CMS_USERNAME_DOMAIN = "cms.pci.id";

export function usernameToAuthEmail(username: string): string {
  const normalized = username.trim().toLowerCase();
  if (normalized.includes("@")) return normalized;
  return `${normalized}@${CMS_USERNAME_DOMAIN}`;
}

export function formatAuthIdentity(email: string): string {
  const suffix = `@${CMS_USERNAME_DOMAIN}`;
  if (email.toLowerCase().endsWith(suffix)) {
    return `@${email.slice(0, -suffix.length)}`;
  }
  return email;
}

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .max(60, "Username maksimal 60 karakter.")
    .regex(
      /^[a-zA-Z0-9._@-]+$/,
      "Username hanya boleh huruf, angka, titik, garis bawah, atau strip.",
    ),
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
