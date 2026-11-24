import type { ZodError } from "zod";

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | {
      ok: false;
      code: "invalid" | "conflict" | "forbidden" | "error";
      message: string;
      fieldErrors?: Record<string, string>;
    };

export function fromZod(error: ZodError): ActionResult<never> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return {
    ok: false,
    code: "invalid",
    message: "Periksa kembali isian yang ditandai merah.",
    fieldErrors,
  };
}

export function fail(error: {
  code?: string | null;
  message?: string | null;
}): ActionResult<never> {
  const pgCode = error.code ?? "";

  if (pgCode === "23505") {
    return {
      ok: false,
      code: "conflict",
      message: "Data dengan nilai yang sama sudah ada.",
    };
  }
  if (pgCode === "23503") {
    return {
      ok: false,
      code: "conflict",
      message: "Data tidak bisa dihapus karena masih dipakai oleh data lain.",
    };
  }
  if (pgCode === "23514") {
    return {
      ok: false,
      code: "invalid",
      message: "Input tidak memenuhi ketentuan format atau panjang karakter.",
    };
  }
  if (pgCode === "42501") {
    return {
      ok: false,
      code: "forbidden",
      message: "Kamu tidak punya izin untuk melakukan aksi ini.",
    };
  }
  if (pgCode === "P0001" && error.message) {
    return {
      ok: false,
      code: "conflict",
      message: error.message,
    };
  }

  return {
    ok: false,
    code: "error",
    message: "Terjadi kesalahan saat menyimpan data. Coba lagi sebentar.",
  };
}
