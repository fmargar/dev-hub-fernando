import type { MetadataRoute } from "next";
import { caseSlugs } from "@/content/cases";
import { profile } from "@/content/profile";
import { toolSlugs } from "@/content/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: profile.site, lastModified, priority: 1 },
    { url: `${profile.site}/work`, lastModified, priority: 0.9 },
    ...caseSlugs.map((slug) => ({
      url: `${profile.site}/work/${slug}`,
      lastModified,
      priority: 0.8,
    })),
    { url: `${profile.site}/experience`, lastModified, priority: 0.7 },
    { url: `${profile.site}/stack`, lastModified, priority: 0.6 },
    { url: `${profile.site}/contact`, lastModified, priority: 0.6 },
    { url: `${profile.site}/tools`, lastModified, priority: 0.5 },
    ...toolSlugs.map((tool) => ({
      url: `${profile.site}/tools/${tool}`,
      lastModified,
      priority: 0.3,
    })),
  ];
}
