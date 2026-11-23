import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-admin-surface px-4 py-12">
      <div className="w-full max-w-[420px] rounded-[32px] border border-admin-line bg-admin-canvas p-7 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2.5 rounded-full bg-admin-ink px-4 text-admin-on-ink"
          >
            <Logo variant="navbar" className="h-6 w-auto" />
          </Link>
          <span className="rounded-full bg-admin-surface px-3 py-1 text-[12px] font-medium text-admin-text-secondary">
            PCI CMS
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}
