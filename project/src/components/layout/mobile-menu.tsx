"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export interface MobileMenuProps {
  whatsappUrl: string;
  instagramUrl: string;
}

export function MobileMenu({ whatsappUrl, instagramUrl }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const prefersReduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const htmlEl = document.documentElement;
    document.body.style.overflow = "hidden";
    htmlEl.classList.add("lenis-stopped");

    const focusTimer = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

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
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = prevOverflow;
      htmlEl.classList.remove("lenis-stopped");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleClose() {
    setOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }

  const easeOutExpo = [0.22, 1, 0.36, 1] as const;

  const menuOverlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          data-tone="dark"
          data-lenis-prevent=""
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={
            prefersReduced
              ? { duration: 0.01 }
              : { duration: 0.28, ease: easeOutExpo }
          }
          className="fixed inset-0 z-[100] flex min-h-[100dvh] flex-col overflow-y-auto bg-ink-900 text-white"
        >
          <Container className="flex min-h-[100dvh] flex-col justify-between pt-4 pb-8">
            <div>
              <div className="flex h-16 items-center justify-between">
                <Link
                  href="/#top"
                  onClick={() => setOpen(false)}
                  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                >
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
                {NAV_LINKS.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? undefined : { opacity: 0, y: 6 }}
                    transition={
                      prefersReduced
                        ? { duration: 0.01 }
                        : {
                            duration: 0.24,
                            delay: 0.05 + idx * 0.04,
                            ease: easeOutExpo,
                          }
                    }
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-14 items-center justify-between border-b border-(--color-divider) py-4 text-nav-mobile text-(--color-fg) transition-colors hover:text-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus)"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, y: 8 }}
                transition={
                  prefersReduced
                    ? { duration: 0.01 }
                    : { duration: 0.26, delay: 0.2, ease: easeOutExpo }
                }
                className="mt-8 flex flex-col gap-3"
              >
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
              </motion.div>
            </div>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? undefined : { opacity: 0 }}
              transition={
                prefersReduced
                  ? { duration: 0.01 }
                  : { duration: 0.22, delay: 0.24 }
              }
              className="pt-8 text-small text-(--color-fg-muted)"
            >
              Step by step, sampai idenya nyala.{" "}
              <span aria-hidden="true">💡</span>
            </motion.p>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );

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

      {isClient ? createPortal(menuOverlay, document.body) : null}
    </div>
  );
}
