"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { trackCtaClick } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/#tentang", label: "Tentang" },
  { href: "/#kegiatan", label: "Kegiatan" },
  { href: "/#webinar", label: "Webinar" },
  { href: "/#faq", label: "FAQ" },
] as const;

export interface SiteNavbarProps {
  whatsappUrl: string;
  instagramUrl: string;
}

export function SiteNavbar({ whatsappUrl, instagramUrl }: SiteNavbarProps) {
  return (
    <header className="relative z-30 pt-4 xl:pt-5">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 xl:h-18">
          <Link
            href="/"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
          >
            <Logo variant="navbar" />
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-10 lg:flex"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-nav text-white/80 transition-colors duration-(--duration-fast) hover:text-white hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button
              variant="primary"
              external
              showExternalIcon={false}
              href={whatsappUrl}
              onClick={() => trackCtaClick("navbar", "whatsapp")}
            >
              Gabung Komunitas
            </Button>
          </div>

          <MobileMenu whatsappUrl={whatsappUrl} instagramUrl={instagramUrl} />
        </div>
      </Container>
    </header>
  );
}
