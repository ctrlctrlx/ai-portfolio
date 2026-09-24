import type { MetadataRoute } from "next";
import {
  publicAbout,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicIdentity,
  publicProjects,
} from "@/src/data/profile";
import { locales } from "@/src/lib/i18n";
import { getAllPostMetas } from "@/src/lib/posts";
import { getSiteUrl } from "@/src/lib/siteUrl";

/**
 * 站点地图：只收录当前真实存在、且对外可访问的公开路由，与实际页面一一对应。
 *
 * - `/[lang]/research` 已永久重定向（301）到 `/[lang]/projects`，不再收录；
 *   原研究内容（研究方向、学术成果与专利）已并入项目经历页。
 * - `/[lang]/blog` 及其文章仅在存在已发布（非草稿）文章时收录，
 *   避免 sitemap 指向空列表页。
 * - 各条目仍按数据层的 public + verified 集合决定是否收录。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const posts = getAllPostMetas();

  const localizedPaths = locales.flatMap((locale) => {
    const basePaths = [`/${locale}`, `/${locale}/projects`];

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
    // 博客：无已发布文章时不产生任何博客路由
    if (posts.length > 0) {
      basePaths.push(`/${locale}/blog`);
    }

    return [
      ...basePaths,
      ...publicProjects.map(
        (project) => `/${locale}/projects/${project.slug}`
      ),
      ...posts.map((post) => `/${locale}/blog/${post.slug}`),
    ];
  });

  return localizedPaths.map((pathname) => ({
    url: new URL(pathname, siteUrl).toString(),
  }));
}
