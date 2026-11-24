import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Product Community Indonesia (PCI) — Belajar & Bertumbuh Bersama",
    template: "%s | Product Community Indonesia",
  },
  description:
    "Komunitas product people Indonesia: PM, PO, product analyst, designer, engineer, mahasiswa, dan career switcher. Sharing session, diskusi, dan kolaborasi.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-meta.jpg",
    apple: "/logo-meta.jpg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Product Community Indonesia",
    images: [
      {
        url: "/logo-meta.jpg",
        alt: "Product Community Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo-meta.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="min-h-screen bg-(--color-bg) font-sans text-(--color-fg) antialiased">
        {children}
      </body>
    </html>
  );
}
