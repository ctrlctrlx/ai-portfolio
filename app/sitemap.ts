import type { MetadataRoute } from "next";
import {
  publicAbout,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicIdentity,
  publicPatents,
  publicProjects,
  publicResearchAreas,
} from "@/src/data/profile";
import { locales } from "@/src/lib/i18n";
import { getAllPostMetas } from "@/src/lib/posts";
import { getSiteUrl } from "@/src/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const localizedPaths = locales.flatMap((locale) => {
    const basePaths = [
      `/${locale}`,
      `/${locale}/projects`,
      `/${locale}/blog`,
    ];
    if (publicAbout) {
      basePaths.push(`/${locale}/about`, `/${locale}/contact`);
    }
    if (
      publicAwards.length > 0 ||
      publicCompetitions.length > 0 ||
      publicCredentials.length > 0
    ) {
      basePaths.push(`/${locale}/honors`);
    }
    if (publicIdentity) {
      basePaths.push(`/${locale}/resume`);
    }
    if (publicResearchAreas.length > 0 || publicPatents.length > 0) {
      basePaths.push(`/${locale}/research`);
    }

    return [
      ...basePaths,
      ...publicProjects.map(
        (project) => `/${locale}/projects/${project.slug}`
      ),
      ...getAllPostMetas().map((post) => `/${locale}/blog/${post.slug}`),
    ];
  });

  return localizedPaths.map((pathname) => ({
    url: new URL(pathname, siteUrl).toString(),
  }));
}
