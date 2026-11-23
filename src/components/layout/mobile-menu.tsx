"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { trackCtaClick } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/#tentang", label: "Tentang" },
  { href: "/#kegiatan", label: "Kegiatan" },
  { href: "/#webinar", label: "Webinar" },
  { href: "/#faq", label: "FAQ" },
] as const;

export interface MobileMenuProps {
  whatsappUrl: string;
  instagramUrl: string;
}

export function MobileMenu({ whatsappUrl, instagramUrl }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleClose() {
    setOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Buka menu navigasi"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="mobile-nav-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink-900 text-white"
        >
          <Container className="flex h-full flex-col justify-between py-6">
            <div>
              <div className="flex h-18 items-center justify-between">
                <Link href="/#top" onClick={() => setOpen(false)}>
                  <Logo variant="navbar" />
                </Link>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Tutup menu navigasi"
                  onClick={handleClose}
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Menu utama" className="mt-8 flex flex-col">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[56px] items-center justify-between border-b border-white/10 py-4 text-[26px] leading-none font-bold text-white transition-colors hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  external
                  href={whatsappUrl}
                  onClick={() => trackCtaClick("menu", "whatsapp")}
                >
                  Gabung Grup WhatsApp
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  external
                  href={instagramUrl}
                  onClick={() => trackCtaClick("menu", "instagram")}
                >
                  Follow Instagram
                </Button>
              </div>
            </div>

            <p className="pt-8 text-small text-stone-300">
              Step by step, sampai idenya nyala.{" "}
              <span aria-hidden="true">💡</span>
            </p>
          </Container>
        </div>
      )}
    </div>
  );
}
