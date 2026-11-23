import { getSiteLinks } from "@/lib/queries/site";
import {
  getActivities,
  getCommunityGroups,
  getFaqs,
  getHeroData,
  getPartners,
  getTeamMembers,
} from "@/lib/queries/home";
import { getWebinarSection } from "@/lib/queries/events";

export async function getLandingData() {
  const [
    links,
    hero,
    partners,
    activities,
    groups,
    webinar,
    team,
    faqs,
  ] = await Promise.all([
    getSiteLinks(),
    getHeroData(),
    getPartners(),
    getActivities(),
    getCommunityGroups(),
    getWebinarSection(),
    getTeamMembers(),
    getFaqs(),
  ]);

  return {
    links,
    hero,
    partners,
    activities,
    groups,
    webinar,
    team,
    faqs,
  };
}
