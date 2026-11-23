import { redirect } from "next/navigation";
import { getStaff } from "@/lib/auth/session";
import { LoginForm } from "@/features/admin/auth/login-form";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  "no-access": "Akun kamu belum punya akses CMS.",
  "auth-callback": "Proses masuk Google gagal. Coba lagi ya.",
  "invalid-link": "Link konfirmasi tidak valid atau sudah kedaluwarsa.",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const staff = await getStaff();
  if (staff) {
    redirect("/admin");
  }

  const params = await searchParams;
  const initialError = params.error
    ? ERROR_MESSAGES[params.error] ?? "Terjadi kendala saat masuk."
    : undefined;

  return (
    <div>
      <h1 className="text-[28px] leading-[1.15] font-normal tracking-[-0.02em] text-admin-ink">
        Masuk ke CMS
      </h1>
      <p className="mt-2 text-[14px] text-admin-text-secondary">
        Khusus pengurus Product Community Indonesia yang sudah diundang.
      </p>
      <div className="mt-7">
        <LoginForm next={params.next} initialError={initialError} />
      </div>
    </div>
  );
}
