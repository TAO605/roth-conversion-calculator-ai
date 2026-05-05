import type { MetadataRoute } from "next";
import { siteConfig } from "@/core/seo/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${siteConfig.siteUrl}/sitemap.xml`, `${siteConfig.siteUrl}/feed.xml`, `${siteConfig.siteUrl}/llms.txt`],
  };
}
