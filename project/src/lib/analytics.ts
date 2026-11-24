"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type CtaLocation =
  | "navbar"
  | "hero"
  | "menu"
  | "webinar_banner"
  | "cta"
  | "footer";

export type CtaTarget = "whatsapp" | "instagram" | "linkedin" | "webinar";

export function trackCtaClick(location: CtaLocation, target: CtaTarget) {
  vercelTrack("cta_click", { location, target });
}

export function trackWebinarTab(category: string) {
  vercelTrack("webinar_tab", { category });
}

export function trackWebinarIgClick(slug: string) {
  vercelTrack("webinar_ig_click", { slug });
}
