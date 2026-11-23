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
          <div className="max-w-[360px]">
            <Link
              href="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
            >
              <Logo variant="footer" />
            </Link>
            <p className="mt-5 text-body-sm text-stone-300">
              Komunitas terbuka bagi para antusias dan profesional di bidang
              product digital di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h2 className="text-[16px] font-bold text-white">Navigasi</h2>
              <ul className="mt-5 flex flex-col gap-4">
                <li>
                  <Link
                    href="/#tentang"
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#kegiatan"
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Kegiatan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#webinar"
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Webinar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq"
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-white">Sosial Media</h2>
              <ul className="mt-5 flex flex-col gap-4">
                <li>
                  <a
                    href={links.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick("footer", "instagram")}
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
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
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
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
                    className="text-[16px] text-stone-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    Grup WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-8 text-small text-stone-300 md:flex-row md:items-center">
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
