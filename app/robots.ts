import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/src/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    ...(siteUrl
      ? { sitemap: new URL("/sitemap.xml", siteUrl).toString() }
      : {}),
  };
}
