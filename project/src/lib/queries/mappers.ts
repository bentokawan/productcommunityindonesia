import type { Tables } from "@/lib/supabase/database.types";
import { publicUrl } from "@/lib/supabase/storage";
import { formatEventDate } from "@/lib/utils";
import { FALLBACK_LINKS, type SiteLinks } from "@/content/fallback-links";

export interface StatViewModel {
  id: string;
  value: string;
  label: string;
}

export interface SlideViewModel {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  captionLong: string;
}

export interface PartnerViewModel {
  id: string;
  name: string;
  url: string | null;
}

export interface ActivityViewModel {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export interface CommunityGroupViewModel {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export interface EventCategoryViewModel {
  id: string;
  slug: string;
  name: string;
}

export interface WebinarCardData {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  editionLabel: string;
  title: string;
  speakers: string;
  posterUrl: string;
  startsAt: string;
  formattedDate: string;
  instagramUrl: string;
}

export interface TeamMemberViewModel {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  linkedinUrl: string | null;
}

export interface FaqViewModel {
  id: string;
  question: string;
  answer: string;
}

export function mapSiteSettings(rows: Tables<"site_settings">[]): SiteLinks {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    whatsappUrl: map.get("whatsapp_url") ?? FALLBACK_LINKS.whatsappUrl,
    instagramUrl: map.get("instagram_url") ?? FALLBACK_LINKS.instagramUrl,
    instagramHandle:
      map.get("instagram_handle") ?? FALLBACK_LINKS.instagramHandle,
    linkedinUrl: map.get("linkedin_url") ?? FALLBACK_LINKS.linkedinUrl,
  };
}

export function mapStatRow(row: Tables<"site_stats">): StatViewModel {
  return {
    id: row.id,
    value: row.value,
    label: row.label,
  };
}

export function mapSlideRow(row: Tables<"hero_slides">): SlideViewModel {
  return {
    id: row.id,
    imageUrl: publicUrl(row.image_path),
    alt: row.alt,
    caption: row.caption,
    captionLong: row.caption_long ?? row.caption,
  };
}

export function mapPartnerRow(row: Tables<"partners">): PartnerViewModel {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
  };
}

export function mapActivityRow(row: Tables<"activities">): ActivityViewModel {
  return {
    id: row.id,
    emoji: row.emoji,
    title: row.title,
    description: row.description,
  };
}

export function mapCommunityGroupRow(
  row: Tables<"community_groups">,
): CommunityGroupViewModel {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    logoUrl: publicUrl(row.logo_path),
  };
}

export function mapEventCategoryRow(
  row: Tables<"event_categories">,
): EventCategoryViewModel {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
  };
}

export type EventWithCategoryRow = Tables<"events"> & {
  event_categories: Pick<Tables<"event_categories">, "slug" | "name"> | null;
};

export function mapEventRow(row: EventWithCategoryRow): WebinarCardData {
  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.event_categories?.slug ?? "",
    categoryName: row.event_categories?.name ?? "",
    editionLabel: row.edition_label,
    title: row.title,
    speakers: row.speakers,
    posterUrl: publicUrl(row.poster_path),
    startsAt: row.starts_at,
    formattedDate: formatEventDate(row.starts_at),
    instagramUrl: row.instagram_url,
  };
}

export function pickNextWebinar(
  events: WebinarCardData[],
  now: Date = new Date(),
): WebinarCardData | null {
  const nowMs = now.getTime();
  const upcoming = events
    .filter((event) => new Date(event.startsAt).getTime() > nowMs)
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  return upcoming[0] ?? null;
}

export function mapTeamMemberRow(
  row: Tables<"team_members">,
): TeamMemberViewModel {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photoUrl: publicUrl(row.photo_path),
    linkedinUrl: row.linkedin_url,
  };
}

export function mapFaqRow(row: Tables<"faqs">): FaqViewModel {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
  };
}
