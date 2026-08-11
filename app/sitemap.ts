import type { MetadataRoute } from "next";
import { caseSlugs } from "@/content/cases";
import { profile } from "@/content/profile";
import { toolSlugs } from "@/content/tools";
import { LOCALES, localizePath } from "@/lib/locale-paths";
import { alternatesFor } from "@/lib/alternates";

/** Una entrada por idioma para una ruta que vive en los tres (home, /work, un
 * caso, /experience, /stack, /contact) — cada una con su propio hreflang
 * apuntando a las otras dos, no solo a la española. */
function localizedEntries(path: string, priority: number, lastModified: Date): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${profile.site}${localizePath(path, locale)}`,
    lastModified,
    priority,
    alternates: { languages: alternatesFor(path, locale).languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...localizedEntries("/", 1, lastModified),
    ...localizedEntries("/work", 0.9, lastModified),
    ...caseSlugs.flatMap((slug) => localizedEntries(`/work/${slug}`, 0.8, lastModified)),
    ...localizedEntries("/experience", 0.7, lastModified),
    ...localizedEntries("/stack", 0.6, lastModified),
    ...localizedEntries("/contact", 0.6, lastModified),
    // Las 33 herramientas no entran en el segmento de idioma: una sola URL,
    // sin alternates de idioma.
    { url: `${profile.site}/tools`, lastModified, priority: 0.5 },
    ...toolSlugs.map((tool) => ({
      url: `${profile.site}/tools/${tool}`,
      lastModified,
      priority: 0.3,
    })),
  ];
}
