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
      <h1 className="text-center text-3xl font-medium tracking-tight text-admin-ink md:text-4xl">
        Welcome back!
      </h1>
      <div className="mt-8">
        <LoginForm next={params.next} initialError={initialError} />
      </div>
    </div>
  );
}
