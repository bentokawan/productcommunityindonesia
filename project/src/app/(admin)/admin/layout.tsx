import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-admin",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PCI CMS",
    template: "%s — PCI CMS",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${plusJakarta.variable} admin-shell min-h-screen bg-admin-canvas text-admin-ink`}
    >
      {children}
      <Toaster
        position="bottom-center"
        duration={4000}
        toastOptions={{
          className:
            "!rounded-full !bg-admin-ink !text-admin-on-ink !border-none !px-5 !py-3 !text-sm !font-medium !shadow-(--admin-shadow-pop)",
        }}
      />
    </div>
  );
}
