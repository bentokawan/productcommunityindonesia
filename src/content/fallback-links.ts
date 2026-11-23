export interface SiteLinks {
  whatsappUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  linkedinUrl: string;
}

export const FALLBACK_LINKS: SiteLinks = {
  whatsappUrl: "https://chat.whatsapp.com/productcommunityid",
  instagramUrl: "https://www.instagram.com/productcommunityid/",
  instagramHandle: "@productcommunityid",
  linkedinUrl: "https://www.linkedin.com/company/productcommunityid/",
};
