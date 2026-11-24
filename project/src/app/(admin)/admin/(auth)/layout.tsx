import Image from "next/image";
import Link from "next/link";
import { adminFocusRing } from "@/features/admin/ui/styles";
import { cn } from "@/lib/utils";

export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-canvas px-5 py-10 sm:px-10">
      <div className="w-full max-w-96">
        <div className="mb-10 flex justify-center">
          <Link
            href="/"
            aria-label="Kembali ke beranda Product Community Indonesia"
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1",
              adminFocusRing,
            )}
          >
            <Image
              src="/logo-landing-black.png"
              alt="Product Community Indonesia"
              width={176}
              height={26}
              priority
              className="h-6 w-auto"
            />
          </Link>
        </div>

        {children}
      </div>
    </main>
  );
}
