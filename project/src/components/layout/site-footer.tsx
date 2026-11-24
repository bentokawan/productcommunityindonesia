"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";
import { trackCtaClick } from "@/lib/analytics";
import type { SiteLinks } from "@/content/fallback-links";

export interface SiteFooterProps {
  links: SiteLinks;
}

export function SiteFooter({ links }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      data-tone="dark"
      className="bg-(--color-bg) pt-16 pb-10 text-(--color-fg) md:pt-20 md:pb-12"
    >
      <Container>
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-90">
            <Link
              href="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
            >
              <Logo variant="footer" />
            </Link>
            <p className="mt-5 text-body text-(--color-fg-muted)">
              Komunitas terbuka bagi para antusias dan profesional di bidang
              product digital di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h2 className="text-base font-bold text-(--color-fg)">
                Navigasi
              </h2>
              <ul className="mt-3 flex flex-col gap-1">
                <li>
                  <Link
                    href="/#tentang"
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#kegiatan"
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Kegiatan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#webinar"
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Webinar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq"
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-(--color-fg)">
                Sosial Media
              </h2>
              <ul className="mt-3 flex flex-col gap-1">
                <li>
                  <a
                    href={links.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick("footer", "instagram")}
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={links.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick("footer", "linkedin")}
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={links.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick("footer", "whatsapp")}
                    className="inline-flex min-h-11 items-center text-base text-(--color-fg-muted) transition-colors hover:text-(--color-fg) hover:underline underline-offset-4 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Grup WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-(--color-divider) pt-8 text-small text-(--color-fg-muted) md:flex-row md:items-center">
          <p>© {year} Product Community Indonesia</p>
          <p>
            Step by step, sampai idenya nyala.{" "}
            <span aria-hidden="true">💡</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
